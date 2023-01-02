import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import { WareHouseLogEntity } from "./ware-house-log.entity";
import { WareHouseLogService } from "./ware-house-log.servic";

@Module({
    imports : [TypeOrmModule.forFeature([WareHouseLogEntity])],
    controllers : [],
    providers : [WareHouseLogService],
    exports : [TypeOrmModule, WareHouseLogService]
})
export class WareHouseLogModule{}
