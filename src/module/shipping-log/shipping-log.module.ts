import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ShippingLogEntity} from "./shipping-log.entity";
import {ShippingLogService} from "./shipping-log.service";


@Module({
    imports : [TypeOrmModule.forFeature([ShippingLogEntity])],
    controllers : [],
    providers : [ShippingLogService],
    exports : [TypeOrmModule, ShippingLogService]
})
export class ShippingLogModule{}
