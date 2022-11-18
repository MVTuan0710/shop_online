import {Body, Controller, Delete, Get, Param, Post, Put, Query, Req, Res, UseGuards} from "@nestjs/common";
import {UserService} from "./user.service";
import {CreateAccountDTO, BodyActiveAccount} from "../users/user.dto";
import {GuardsJwt} from "../auth/guard/guards.jwt";
import {ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiTags} from "@nestjs/swagger";
import {UserEntity} from "./user.entity";

@ApiTags('user')
@Controller('user')
// @UseGuards(GuardsJwt)
// @ApiBearerAuth('JWT-auth')
export class UserController{
    constructor(private userService  : UserService) {}

    // get all account
    // @Roles(EnumRole.ADMIN)
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
    // @Roles(EnumRole.ADMIN,EnumRole.SUPPORT)
    @Get('/id/:user_id')
    async getAccountByID(@Res() res, @Param('user_id') user_id : string) : Promise<any>{
        return this.userService.getAccountById(user_id).then(result =>{
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
    // // @Roles(EnumRole.ADMIN)
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
    // @Roles(EnumRole.ADMIN)
    @Delete('delete/:account_id')
    async deleteAccount(@Res() res , @Param('account_id') account_id : string) : Promise<any>{
        return this.userService.deleteAccount(account_id).then(result =>{
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