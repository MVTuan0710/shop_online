import {forwardRef, Module} from "@nestjs/common";
import {OderDetailController} from "./oder-detail.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {OderDetailEntity} from "./oder-detail.entity";
import {OderDetailService} from "./oder-detail.service";
import { ItemModule } from "../item/item.module";
import { SaleModule } from "../sale/sale.module";
import { SaleItemModule } from "../sale-item/sale-item.module";


@Module({
    imports : [TypeOrmModule.forFeature([OderDetailEntity]), 
    forwardRef(()=>ItemModule),
    forwardRef(()=>SaleModule),
    forwardRef(()=> SaleItemModule)],
    controllers : [OderDetailController],
    providers : [OderDetailService],
    exports : [TypeOrmModule, OderDetailService]
})
export class OderDetailModule{}
