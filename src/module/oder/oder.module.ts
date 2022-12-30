import {Module, forwardRef} from "@nestjs/common";
import {OderController} from "./oder.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {OderEntity} from "./oder.entity";
import {OderService} from "./oder.service";
import { UserModule } from "../users/user.module";
import { OderDetailModule } from "../oder-detail/oder-detail.module";
import { WareHouseModule } from "../ware-house/ware-house.module";
import { SaleModule } from "../sale/sale.module";
import { SaleItemModule } from "../sale-item/sale-item.module";


@Module({
    imports : [TypeOrmModule.forFeature([OderEntity]),
    forwardRef(()=> UserModule),
    forwardRef(()=> OderDetailModule),
    forwardRef(()=> WareHouseModule),
    forwardRef(()=> SaleModule),
    forwardRef(()=> SaleItemModule)
],
    controllers : [OderController],
    providers : [OderService],
    exports : [TypeOrmModule, OderService]
})
export class OderModule{}
