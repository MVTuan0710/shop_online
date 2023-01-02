import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import { ItemLogEntity } from "./item_log.entity";
import { ItemLogService } from "./item_log.service";

@Module({
    imports : [TypeOrmModule.forFeature([ItemLogEntity])],
    controllers : [],
    providers : [ItemLogService],
    exports : [TypeOrmModule, ItemLogService]
})
export class ItemLogModule{}
