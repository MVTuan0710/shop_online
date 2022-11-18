import {IsNotEmpty, MinLength} from "class-validator";


export class CreateRoleDTO{
    @IsNotEmpty()
    id : number;

    @MinLength(6)
    fullname : string;
}
