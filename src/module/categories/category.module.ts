import {forwardRef, Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import { CategoryEntity } from "./category.entity";
import { WareHouseModule } from "../ware-house/ware-house.module";
import { CategoryController } from "./category.controller";
import { CategoryService } from "./category.service";


@Module({
    imports :[TypeOrmModule.forFeature([CategoryEntity])
    ],
    controllers : [CategoryController],
    providers : [CategoryService],
    exports : [CategoryService,TypeOrmModule],
})
export class CategoryModule{}
