import {forwardRef, Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import { ItemEntity } from "./item.entity";
import { CategoryModule } from "../categories/category.module";
import { ItemController } from "./item.controller";
import { ItemService } from "./item.service";
import {ConfigModule, ConfigService} from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { ItemLogModule } from "../item-log/item_log.module";
import { UserModule } from "../users/user.module";


@Module({
    imports :[TypeOrmModule.forFeature([ItemEntity]),
        forwardRef(()=>CategoryModule),forwardRef(()=>ItemLogModule),forwardRef(()=> UserModule),
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
        }))
    ],
    controllers : [ItemController],
    providers : [ItemService],
    exports : [ItemService,TypeOrmModule],
})
export class ItemModule{}
