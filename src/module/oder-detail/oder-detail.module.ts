import {Module} from "@nestjs/common";
import {OderDetailController} from "./oder-detail.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {OderDetailEntity} from "./oder-detail.entity";
import {OderDetailService} from "./oder-detail.service";


@Module({
    imports : [TypeOrmModule.forFeature([OderDetailEntity])],
    controllers : [OderDetailController],
    providers : [OderDetailService],
    exports : [TypeOrmModule, OderDetailService]
})
export class OderDetailModule{}
