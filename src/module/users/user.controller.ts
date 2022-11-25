import {Body, Controller, Delete, Get, Header, Headers, Param, Post, Put, Req, Res, UseGuards} from "@nestjs/common";
import {UserService} from "./user.service";
import {CreateAccountDTO} from "../users/user.dto";
import {GuardsJwt} from "../auth/guard/guards.jwt";
import { RolesGuard } from "../role/guards/role.guards";
import { Roles } from '../decorator/role.decorator';
import { EnumRole } from '../constant/role/role.constant';
import { AuthModule } from "../auth/auth.module";
import { HeaderObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";
// import { Middleware10Builder } from "@nestjs/core";


@Controller('user')
// @UseGuards(GuardsJwt, RolesGuard)
export class UserController{
    constructor(private userService  : UserService) {}

    // get all account
    // @Roles(EnumRole.super_admin)
    @Get('get-all')
    async getAll(@Res() res) : Promise<any>{
        return this.userService.find().then(result =>{
            res.status(200).json({
                message : 'success',
                result,
            });
        }).catch(err =>{
            res.status(500).json({
                message : 'failed',
                err,
            });
        })
    }

    // get account by Id
    // @Roles(EnumRole.super_admin)
    @Get('/id/:user_id')
    async getByIdRelationRole(@Res() res, @Param('user_id') user_id : string) : Promise<any>{
        return this.userService.getByIdRelationRole(user_id).then(result =>{
            res.status(200).json({
                message : 'success',
                result,
            });
        }).catch(err =>{
            res.status(500).json({
                message : 'failed',
                err,
            })
        })
    }

    @Roles(EnumRole.super_admin,EnumRole.warehouse_manager)
    @Get('/get-name/:name')
    async getByName(@Res() res, @Param('name') name : string) : Promise<any>{
        return this.userService.getByName(name).then(result =>{
            res.status(200).json({
                message : 'success',
                result,
            });
        }).catch(err =>{
            res.status(500).json({
                message : 'failed',
                err,
            })
        })
    }
    
    @Roles(EnumRole.super_admin,EnumRole.warehouse_manager)
    @Get('/get-phone/:phone')
    async getByPhone(@Req() req,@Res() res, @Param('phone') phone : string, @Headers()header: string) : Promise<any>{
        return this.userService.getByPhone(phone,header).then(result =>{
            res.status(200).json({
                message : 'success',
                result,
            });
        }).catch(err =>{
            res.status(500).json({
                message : 'failed',
                err,
            })
        })
    }

    // @Roles(EnumRole.super_admin, EnumRole.user)
    @Post('/create')
    async create(@Res() res, @Body()data: CreateAccountDTO, @Headers()token: string) : Promise<any>{
        return this.userService.createAccount(data, token).then(result =>{
            res.status(200).json({
                message : 'success',
                result,
            });
        }).catch(err =>{
            res.status(500).json({
                message : 'failed',
                err,
            })
        })
    }

    // find account by Email
    @Roles(EnumRole.super_admin)
    @Get('/email/:email')
    async getAccountByEmail(@Res() res, @Param('email') email : string) : Promise<any>{
        return this.userService.getAccountByEmail(email).then(result =>{
            res.status(200).json({
                message : 'success',
                result,
            });
        }).catch(err =>{
            res.status(500).json({
                message : 'failed',
                err,
            })
        })
    }

    // update account
    @Roles(EnumRole.super_admin)
    @Put('/:account_id')
    async putAccount(@Body() body : CreateAccountDTO, @Res() res, @Param('account_id')
        account_id : string ): Promise<any> {
        return this.userService.updateAccount(account_id, body).then(result =>{
            res.status(200).json({
                message : 'Account is updated',
                result,
            });
        }).catch(err =>{
            console.log();
            res.status(500).json({
                message : 'update failed',
                err,
            });
        })
    }

    // delete account
    @Roles(EnumRole.super_admin, EnumRole.user)
    @Delete('delete/:account_id')
    async deleteAccount(@Res() res , @Param('account_id') account_id : string, @Headers()token: string) : Promise<any>{
        return this.userService.deleteAccount(account_id,token).then(result =>{
            res.status(200).json({
                message : 'Account is deleted',
                result,
            });
        }).catch(err => {
            res.status(500).json({
                message : 'delete failed',
                err,
            });
        })
    }
}