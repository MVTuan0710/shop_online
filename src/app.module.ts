import { Module } from '@nestjs/common';
import {CoreModule} from "./module/core/core.module";
import {UserModule} from "./module/users/user.module";
import {RoleModule} from "./module/role/role.module";

@Module({
  imports: [
    CoreModule,
    UserModule,
    RoleModule
  ]
})
export class AppModule {}
