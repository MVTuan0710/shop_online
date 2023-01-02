import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {Strategy} from 'passport-local';
import {AuthService} from "../auth.service";

@Injectable()
export class StrategyLocal extends PassportStrategy(Strategy){
    constructor(private authService : AuthService) {
        super({
            usernameField : 'email',
            passwordField : 'password',
        })
    }

    // auto call
    async validate(username : string, password : string) : Promise<any>{
        const account = await this.authService.validateAccount(username,password);
        if (!account.is_active) {
            throw new HttpException('Account is not activated', HttpStatus.UNAUTHORIZED);
        }
        return account;
    }
}