import { IsString, IsNotEmpty, Length } from 'class-validator';

export class SearchQueryDto {
  @IsNotEmpty()
  @IsString()
  accessToken: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 20)
  searchString: string;
}
