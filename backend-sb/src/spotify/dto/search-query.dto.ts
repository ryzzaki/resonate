import { IsString, IsNotEmpty, Max, Length } from 'class-validator';

export class SearchQueryDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 20)
  searchString: string;
}
