import {forwardRef, Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "./user.entity";
import {UserController} from "./user.controller";
import {UserService} from "./user.service";
import {AuthModule} from "../auth/auth.module";
import { RoleModule } from "../role/role.module";
import { OderModule } from "../oder/oder.module";
import { JwtModule } from "@nestjs/jwt";
import {ConfigModule, ConfigService} from "@nestjs/config";
import { ItemModule } from "../item/item.module";
import { UserLogModule } from "../user-log/user-log.module";



@Module({
    imports :[TypeOrmModule.forFeature([UserEntity]),
    forwardRef(()=>JwtModule.registerAsync({
        imports : [ConfigModule],
        inject : [ConfigService],
        useFactory: async(configService : ConfigService) =>({
            secret : configService.get<string>('jwt.secret'),
            // secret : 'dasdasd',
            signOptions : {
                expiresIn : configService.get<string>('jwt.expires_in'),
            } 
        }),
    })),
    forwardRef(()=>AuthModule),forwardRef(()=> RoleModule),
    forwardRef(()=> OderModule),forwardRef(()=> ItemModule),
    forwardRef(()=> UserLogModule)
    ],
    controllers : [UserController],
    providers : [UserService],
    exports : [UserService,TypeOrmModule],
})
export class UserModule{}
