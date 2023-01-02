import {forwardRef, Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import { SaleLogModule } from "../sale-log/sale-log.module";
import { SaleController } from "./sale.controller";
import { SaleEntity } from "./sale.entity";
import { SaleService } from "./sale.service";

@Module({
    imports : [TypeOrmModule.forFeature([SaleEntity]),
    forwardRef(()=> SaleLogModule)],
    controllers : [SaleController],
    providers : [SaleService],
    exports : [TypeOrmModule, SaleService]
})
export class SaleModule{}
