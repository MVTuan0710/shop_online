import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import { SaleLogEntity } from "./sale-log.entity";
import { SaleLogService } from "./sale-log.service";

@Module({
    imports : [TypeOrmModule.forFeature([SaleLogEntity])],
    controllers : [],
    providers : [SaleLogService],
    exports : [TypeOrmModule, SaleLogService]
})
export class SaleLogModule{}
