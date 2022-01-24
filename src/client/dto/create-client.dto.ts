import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateClientDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  name: string;

  @IsNotEmpty()
  @IsString()
  gender: string;

  @IsNotEmpty()
  @IsDateString()
  birth_date: string;

  age: number;

  @IsNotEmpty()
  @IsNumber()
  city_id: number;
}
