import {forwardRef, Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import { ItemModule } from "../item/item.module";
import { SaleModule } from "../sale/sale.module";
import { SaleItemController } from "./sale-item.controller";
import { SaleItemEntity } from "./sale-item.entity";
import { SaleItemService } from "./sale-item.service";

@Module({
    imports : [TypeOrmModule.forFeature([SaleItemEntity]),
    forwardRef(()=>ItemModule),forwardRef(()=>SaleModule)],
    controllers : [SaleItemController],
    providers : [SaleItemService],
    exports : [TypeOrmModule, SaleItemService]
})
export class SaleItemModule{}
