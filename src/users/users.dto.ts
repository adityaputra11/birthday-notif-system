import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsDateString, IsOptional, IsEmail, IsTimeZone } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  firstname: string;

  @IsNotEmpty()
  @IsString()
  lastname: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsDateString()
  birthday: string; // Format: YYYY-MM-DD

  @IsNotEmpty()
  @IsString()
  @IsTimeZone()
  timezone: string; // Contoh: "America/New_York"
}

export class UpdateUserDto extends PartialType(CreateUserDto)  {}