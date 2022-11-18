import {IsEmpty, IsNotEmpty} from "class-validator";
import { BodyLogin } from "../auth/auth.dto";
import {RoleEntity} from "../role/role.entity";

export class CreateAccountDTO extends BodyLogin{
    @IsNotEmpty()
    name : string;

    @IsNotEmpty()
    phone : string;

    @IsEmpty()
    role_id : RoleEntity;

    is_active: boolean;

    verify_token : string;
}
export class BodyActiveAccount{
    @IsNotEmpty()
    is_active: boolean;
}
