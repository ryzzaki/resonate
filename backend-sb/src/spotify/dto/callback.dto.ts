import { IsOptional, IsString } from 'class-validator';

export class CallbackDto {
  @IsOptional()
  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  error: string;
}
