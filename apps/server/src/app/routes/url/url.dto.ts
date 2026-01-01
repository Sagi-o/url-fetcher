import { IsString, IsArray, MinLength } from 'class-validator';

export class FetchUrlsDTO {
  @IsArray()
  @IsString({ each: true })
  @MinLength(1)
  urls!: string[];
}
