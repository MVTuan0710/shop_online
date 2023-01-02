import {IsNotEmpty, MinLength} from "class-validator";


export class CreateRoleDTO{
    @IsNotEmpty()
    role_id : number;

    @MinLength(6)
    fullname : string;
}
