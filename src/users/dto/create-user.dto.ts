import { Transform } from 'class-transformer';
import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  IsNotEmpty,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @Transform(({ value }) => {
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'string') return value.trim();
    return value;
  })
  @IsString({ message: 'El nombre debe ser un texto.' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío.' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres.' })
  @MaxLength(50, { message: 'El nombre debe tener máximo 50 caracteres.' })
  @Matches(/.*[a-zA-Z].*/, {
    message: 'El nombre debe contener al menos una letra.',
  })
  readonly name: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'El email debe ser un texto.' })
  @IsEmail({}, { message: 'El email no es válido.' })
  @MinLength(5, { message: 'El email debe tener al menos 5 caracteres.' })
  @MaxLength(50, { message: 'El email no puede exceder los 50 caracteres.' })
  readonly email: string;
}
