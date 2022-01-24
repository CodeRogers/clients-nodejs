import { IsNotEmpty, IsString, MinLength, minLength } from "class-validator";

export class CreateStateDto {
  @IsString()
  @MinLength(2)
  @IsNotEmpty()
  name: string
}
