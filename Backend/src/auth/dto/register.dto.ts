import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  Matches,
  IsBoolean,
} from 'class-validator';
import { UserRole } from '../../users/schemas/user.schema.js';

export class RegisterDto {
  @IsString()
  @IsNotEmpty({ message: 'Full name is required' })
  @MinLength(2, { message: 'Full name must be at least 2 characters' })
  name: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email address is required' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
  @Matches(/^[+]?[0-9\s\-()]{10,18}$/, {
    message: 'Please provide a valid phone number (at least 10 digits)',
  })
  phone: string;

  @IsEnum(UserRole, { message: 'Role must be either seeker or employer' })
  role: UserRole;

  @IsOptional()
  @IsString()
  companyName?: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/, {
    message:
      'Password must include uppercase, lowercase, number, and special character',
  })
  password: string;

  @IsOptional()
  @IsBoolean()
  agreeTerms?: boolean;
}

