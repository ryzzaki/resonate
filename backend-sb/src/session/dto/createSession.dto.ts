import { RoomAccess } from '../interfaces/roomAccess.enum';
import { IsString, IsEnum, Length, MaxLength, IsOptional } from 'class-validator';

export class CreateSessionDto {
  @IsString()
  @Length(3, 30)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  description?: string;

  @IsEnum(RoomAccess)
  roomAccess: RoomAccess;
}
