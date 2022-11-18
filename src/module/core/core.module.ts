import {Module} from "@nestjs/common";
import {ConfigModule, ConfigService} from "@nestjs/config";
import configuration from "../../config/configuration";
import {TypeOrmModule} from "@nestjs/typeorm";
import {join} from "path";
import {MailerModule} from "@nestjs-modules/mailer";
import {HandlebarsAdapter} from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import {ScheduleModule} from "@nestjs/schedule";
import {UserEntity} from "../users/user.entity";
import {RoleEntity} from "../role/role.entity";
const NODE_ENV = process.env.NODE_ENV;
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
                // autoLoadEntities: true,
                entities: [UserEntity, RoleEntity],
                // synchronize : true,
            }),
        })
    ],
    exports : [ConfigModule,TypeOrmModule]
})
export class CoreModule{}