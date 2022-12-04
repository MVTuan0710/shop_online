import {Module, forwardRef} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import { UserModule } from "../users/user.module";
import { ShippingEntity } from "./shipping.entity";
import { ShippingService } from "./shipping.service";
import { OderModule } from "../oder/oder.module";
import {ShippingController} from "./shipping.controller"
import { JwtModule } from "@nestjs/jwt";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {ShippingLogModule} from "../shipping-log/shipping-log.module";

@Module({
    imports : [TypeOrmModule.forFeature([ShippingEntity]),
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
    })), forwardRef(()=> UserModule), forwardRef(()=>OderModule), forwardRef(()=>ShippingLogModule)],
    controllers : [ShippingController ],
    providers : [ShippingService],
    exports : [TypeOrmModule, ShippingService]
})
export class ShippingModule{}
