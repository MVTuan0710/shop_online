import {forwardRef, Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {WareHouseEntity} from "./ware-house.entity";
import {WareHouseController} from "./ware-house.controller";
import {WareHouseService} from "./ware-house.service";
import { UserModule } from "../users/user.module";
import { ItemModule } from "../item/item.module";
import {WareHouseLogModule} from "../ware-house-log/ware-house-log.module";


@Module({
    imports :[TypeOrmModule.forFeature([WareHouseEntity]),
        forwardRef(()=>UserModule),
        forwardRef(()=>ItemModule),
        forwardRef(()=>WareHouseLogModule)
    ],
    controllers : [WareHouseController],
    providers : [WareHouseService],
    exports : [WareHouseService,TypeOrmModule],
})
export class WareHouseModule{}
