import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  firstname: string;

  @IsNotEmpty()
  @IsString()
  lastname: string;

  @IsNotEmpty()
  @IsDateString()
  birthday: string; // Format: YYYY-MM-DD

  @IsNotEmpty()
  @IsString()
  timezone: string; // Contoh: "America/New_York"
}

export class UpdateUserDto extends PartialType(CreateUserDto)  {}