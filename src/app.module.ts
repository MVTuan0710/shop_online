import { Module } from '@nestjs/common';
import {CoreModule} from "./module/core/core.module";
import {UserModule} from "./module/users/user.module";
import {RoleModule} from "./module/role/role.module";
import { AuthModule } from './module/auth/auth.module';
import { WareHouseModule } from './module/ware-house/ware-house.module';
import { ItemModule } from './module/item/item.module';
import { CategoryModule } from './module/categories/category.module';
import { OderDetailModule } from './module/oder-detail/oder-detail.module';
import { OderModule } from './module/oder/oder.module';
import { ShippingModule } from './module/shipping/shipping.module';
import { ItemLogModule } from './module/item-log/item_log.module';
import {WareHouseLogModule} from "./module/ware-house-log/ware-house-log.module";
import {ShippingLogModule} from "./module/shipping-log/shipping-log.module";
import {OderDetailLogModule} from "./module/oder-detial-log/oder-detail.module";
import { UserLogModule } from './module/user-log/user-log.module';

@Module({
  imports: [
    //core
    CoreModule,

    UserModule,
    RoleModule,
    AuthModule, 
    WareHouseModule,
    ItemModule, 
    CategoryModule, 
    OderDetailModule,
    OderModule,
    ShippingModule,

    //log
    ItemLogModule,
    WareHouseLogModule,
    ShippingLogModule,
    OderDetailLogModule,
    UserLogModule
  ]
})
export class AppModule {}
