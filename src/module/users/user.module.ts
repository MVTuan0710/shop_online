import {forwardRef, Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "./user.entity";
import {UserController} from "./user.controller";
import {UserService} from "./user.service";
import {AuthModule} from "../auth/auth.module"
import { RoleModule } from "../role/role.module";
import { OderModule } from "../oder/oder.module";


@Module({
    imports :[TypeOrmModule.forFeature([UserEntity]),
    forwardRef(()=>AuthModule),forwardRef(()=> RoleModule),forwardRef(()=> OderModule)
    ],
    controllers : [UserController],
    providers : [UserService],
    exports : [UserService,TypeOrmModule],
})
export class UserModule{}
