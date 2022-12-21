import { UserEntity } from "../users/user.entity";


export class CreateUserLogDTO{
    userEntity: UserEntity;
    email: string;
    name : string;
    address:  string;
    phone : string;
}
