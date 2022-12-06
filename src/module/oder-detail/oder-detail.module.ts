import {Module, forwardRef} from "@nestjs/common";
import {OderDetailController} from "./oder-detail.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {OderDetailEntity} from "./oder-detail.entity";
import {OderDetailService} from "./oder-detail.service";
import { ItemModule } from "../item/item.module";
import { OderModule } from "../oder/oder.module";
import { WareHouseModule } from "../ware-house/ware-house.module";
import {ConfigModule, ConfigService} from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import {OderDetailLogModule} from "../oder-detial-log/oder-detail.module";
import { UserModule } from "../users/user.module";

@Module({
    imports : [TypeOrmModule.forFeature([OderDetailEntity]),
    forwardRef(()=> ItemModule),forwardRef(()=> OderModule),forwardRef(()=> WareHouseModule),
    forwardRef(()=>OderDetailLogModule),forwardRef(()=>UserModule),
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
    controllers : [OderDetailController],
    providers : [OderDetailService],
    exports : [TypeOrmModule, OderDetailService]
})
export class OderDetailModule{}
