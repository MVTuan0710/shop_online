import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import { UserLogEntity } from "./user-log.entity";
import { UserLogService } from "./user-log.service";

@Module({
    imports : [TypeOrmModule.forFeature([UserLogEntity])],
    controllers : [],
    providers : [UserLogService],
    exports : [TypeOrmModule, UserLogService]
})
export class UserLogModule{}
