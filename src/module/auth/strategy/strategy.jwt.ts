import {Injectable, UnauthorizedException} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {ConfigService} from "@nestjs/config";
import {UserService} from "../../users/user.service";
import {ExtractJwt, Strategy} from "passport-jwt";
import {RoleEntity} from "../../role/role.entity";

@Injectable()
export class StrategyJwt extends PassportStrategy(Strategy){
    constructor(
        private readonly configService : ConfigService,
        private readonly userService : UserService
    ) {
        super({
            jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('jwt.secret'),
        })
    }

    // auto call
    // validate
    async validate(payload : any){
        const payLoadUsername = payload.email;
        const user = await this.userService.findByUsernameAndSelectRole(payLoadUsername);
        if(!user){
            throw new UnauthorizedException();
        }

        // req.user
        const { roleEntity } = user
        const _role : RoleEntity = <RoleEntity> roleEntity;
        if(!_role){
            return{
                id : payload.id,
                email : payload.email,
                role_id : null,
            }
        }
        const { role_id : roleId } = _role;
        return {
            id : payload.id,
            email : payload.email,
            role_id : roleId,
        }
    }

}