import {IsEmail, IsNotEmpty, MinLength} from "class-validator";

export class BodyLogin{
    @IsNotEmpty()
    @IsEmail()
    email : string;

    @MinLength(6)
    password : string;
}
