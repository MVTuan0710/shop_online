import { UserEntity } from "../users/user.entity";


export class CreateUserLogDTO{
    userEntity: UserEntity;
    email: string;
    name : string;
    phone : string;
}
