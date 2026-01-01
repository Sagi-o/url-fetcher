import { IsString, IsArray, IsUrl } from 'class-validator';

export class FetchUrlsDTO {
  @IsArray()
  @IsString({ each: true })
  @IsUrl({}, { each: true, message: 'Each item must be a valid URL' })
  urls!: string[];
}
