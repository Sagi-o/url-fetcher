import { plainToInstance } from 'class-transformer';
import { validateOrReject, ValidationError } from 'class-validator';
import { BadRequestError } from './http-errors';

export async function validateDTO<T>(
  DTOClass: new () => T,
  payload: any
): Promise<T> {
  const dtoInstance = plainToInstance(DTOClass, payload);
  try {
    await validateOrReject(dtoInstance as object, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });
    return dtoInstance;
  } catch (errors) {
    const validationErrors = formatValidationErrors(
      errors as ValidationError[]
    );
    throw new BadRequestError(validationErrors.join('; '));
  }
}

const formatValidationErrors = (errors: ValidationError[]): string[] => {
  const errorMessages: string[] = [];

  const processError = (error: ValidationError, path = '') => {
    if (error.constraints) {
      const constraintMessages = Object.values(error.constraints);
      errorMessages.push(
        `${path}${error.property}: ${constraintMessages.join(', ')}`
      );
    }

    if (error.children && error.children.length > 0) {
      error.children.forEach((childError) => {
        const newPath = path
          ? `${path}${error.property}.`
          : `${error.property}.`;
        processError(childError, newPath);
      });
    }
  };

  errors.forEach((error) => processError(error));

  return errorMessages;
};
