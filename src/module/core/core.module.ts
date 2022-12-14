import {Module} from "@nestjs/common";
import {ConfigModule, ConfigService} from "@nestjs/config";
import configuration from "../../config/configuration";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ScheduleModule} from "@nestjs/schedule";
import {UserEntity} from "../users/user.entity";
import {RoleEntity} from "../role/role.entity";
import { WareHouseEntity } from "../ware-house/ware-house.entity";
import { ItemEntity } from "../item/item.entity";
import { CategoryEntity } from "../categories/category.entity";
import { OderDetailEntity } from "../oder-detail/oder-detail.entity";
import { OderEntity } from "../oder/oder.entity";
import { ShippingEntity } from "../shipping/shipping.entity";
import { ItemLogEntity } from "../item-log/item_log.entity";
import {OderDetailLogEntity} from "../oder-detial-log/oder-detail-log.entity";
import {WareHouseLogEntity} from "../ware-house-log/ware-house-log.entity";
import {ShippingLogEntity} from "../shipping-log/shipping-log.entity";
import { UserLogEntity } from "../user-log/user-log.entity";
import { SaleEntity } from "../sale/sale.entity";
import { SaleLogEntity } from "../sale-log/sale-log.entity";
import { SaleItemEntity } from "../sale-item/sale-item.entity";


@Module({
    imports :[
        ScheduleModule.forRoot(),
        ConfigModule.forRoot({
            // envFilePath : `./env/${NODE_ENV ? '.' + NODE_ENV.trim() : ''}.env`,
            envFilePath : `./env/.env`,
            isGlobal : true,
            load : [configuration]
        }),
        TypeOrmModule.forRootAsync({
            imports : [ConfigModule],
            inject : [ConfigService],
            useFactory :async () => ({
                type:'postgres',
                host:'localhost',
                port: 5432,
                username: 'postgres',
                password: '123',
                database: 'test_db_shop_online',
                entities: [UserEntity, RoleEntity, WareHouseEntity,
                            ItemEntity, CategoryEntity, OderDetailEntity,
                            OderDetailLogEntity, OderEntity, ShippingEntity,
                            ItemLogEntity, WareHouseLogEntity, ShippingLogEntity,
                            UserLogEntity,SaleEntity, SaleLogEntity, SaleItemEntity]
            }),
        })
    ],
    exports : [ConfigModule,TypeOrmModule]
})
export class CoreModule{}