import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {OderDetailLogEntity} from "./oder-detail-log.entity";
import { OderDetailLogService } from "./oder-detail.service";

@Module({
    imports : [TypeOrmModule.forFeature([OderDetailLogEntity])],
    controllers : [],
    providers : [OderDetailLogService],
    exports : [TypeOrmModule, OderDetailLogService]
})
export class OderDetailLogModule{}
