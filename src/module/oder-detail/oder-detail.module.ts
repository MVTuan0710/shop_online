import {Module, forwardRef} from "@nestjs/common";
import {OderDetailController} from "./oder-detail.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {OderDetailEntity} from "./oder-detail.entity";
import {OderDetailService} from "./oder-detail.service";
import { ItemModule } from "../item/item.module";
import { WareHouseModule } from "../ware-house/ware-house.module";
import {OderDetailLogModule} from "../oder-detial-log/oder-detail.module";
import { UserModule } from "../users/user.module";
import { SaleModule } from "../sale/sale.module";
import { OderModule } from "../oder/oder.module";

@Module({
    imports : [TypeOrmModule.forFeature([OderDetailEntity]),
    forwardRef(()=> WareHouseModule),
    forwardRef(()=>UserModule),
    forwardRef(()=> ItemModule),
    // forwardRef(()=> OderModule),
    forwardRef(()=>OderDetailLogModule),
    forwardRef(()=>SaleModule)],
    
    controllers : [OderDetailController],
    providers : [OderDetailService],
    exports : [TypeOrmModule,  OderDetailService]
})
export class OderDetailModule{}
