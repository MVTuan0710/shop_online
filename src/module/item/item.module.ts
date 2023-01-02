import {forwardRef, Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import { ItemEntity } from "./item.entity";
import { CategoryModule } from "../categories/category.module";
import { ItemController } from "./item.controller";
import { ItemService } from "./item.service";
import { ItemLogModule } from "../item-log/item_log.module";
import { UserModule } from "../users/user.module";


@Module({
    imports :[TypeOrmModule.forFeature([ItemEntity]),
        forwardRef(()=>CategoryModule),forwardRef(()=>ItemLogModule),
        forwardRef(()=> UserModule)],
    controllers : [ItemController],
    providers : [ItemService],
    exports : [ItemService,TypeOrmModule],
})
export class ItemModule{}
