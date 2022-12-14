import {Module, forwardRef} from "@nestjs/common";
import {OderController} from "./oder.controlller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {OderEntity} from "./oder.entity";
import {OderService} from "./oder.service";
import { UserModule } from "../users/user.module";
import { OderDetailModule } from "../oder-detail/oder-detail.module";
import { OderDetailEntity } from "../oder-detail/oder-detail.entity";

@Module({
    imports : [TypeOrmModule.forFeature([OderEntity]),
    forwardRef(()=> UserModule),
    forwardRef(()=> OderDetailModule)
],
    controllers : [OderController],
    providers : [OderService],
    exports : [TypeOrmModule, OderService]
})
export class OderModule{}
