import {IsNotEmpty} from "class-validator";
import { BodyLogin } from "../auth/auth.dto";

export class CreateAccountDTO extends BodyLogin{
    @IsNotEmpty()
    name : string;

    @IsNotEmpty()
    phone : string;

    @IsNotEmpty()
    role_id : number;

    is_active: boolean;

    verify_token : string;
}

export class BodyActiveAccount{
    @IsNotEmpty()
    is_active: boolean;
}

export class BodyGetOneAccount{
    @IsNotEmpty()
    phone : string;

    @IsNotEmpty()
    name: string;

    email: string

}