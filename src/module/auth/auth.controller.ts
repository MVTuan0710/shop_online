import {Body, Controller, Get, Param, Post, Req, Res} from "@nestjs/common";
import {CreateAccountDTO} from "../users/user.dto";
import { BodyLogin } from "./auth.dto";
import {AuthService} from "./auth.service";


@Controller('auth')
export class AuthController{
    constructor( private authService : AuthService ) {}

    @Post('login')
    async logIn(@Body() _data : BodyLogin, @Res() res) : Promise<any>{
        return this.authService.LoginAccount(_data).then(result =>{
            res.status(200).json({
                message : 'successful',
                result,
            });
        }).catch(err =>{
            res.status(500).json({
                message : 'failed',
                err,
            });
        })
    }

    @Post('register')
    async register(@Body() body : CreateAccountDTO, @Res() res, @Req() req) :  Promise<any>{
        return this.authService.register(body).then(result =>{
            res.status(200).json({
                result,
                message : 'successful',
            });
        }).catch(err =>{
            res.status(500).json({
                message : 'failed',
                err,
            });
        })
    }

    @Get('verify/:token')
    async verify(@Res() res, @Param('token') token : string) : Promise<any>{
        return this.authService.verifyAccount(token).then(result =>{
            res.status(200).json({
                message : 'successful',
                result,
            });
        }).catch(err =>{
            res.status(500).json({
                message : 'failed',
                err,
            });
        })
    }
}