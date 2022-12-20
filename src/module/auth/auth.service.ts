import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {UserService} from '../users/user.service';
import {CreateAccountDTO} from "../users/user.dto";
import {UserEntity} from "../users/user.entity";
import {JwtService} from "@nestjs/jwt";
import { BodyLogin } from "./auth.dto";


@Injectable()
export class AuthService{
    constructor(private readonly userService : UserService,
                private readonly jwtService : JwtService,
    ) {}

    // create account
    async register(data : CreateAccountDTO) : Promise<UserEntity>{
        try {
            const result: UserEntity =  await this.userService.register(data);
            return result;
        }catch (err){
            console.log('errors',err);
            throw console.log('Create fail');
        }
    }


    // verify token
    async verifyAccount(token : string) : Promise<UserEntity>{
       try {
           const data: UserEntity = await this.userService.getByVerifyToken(token);
           if(!data){
                throw console.log('The account is not exists');
           }
           if(data.is_active == true){
                throw console.log('The account is activated');
           }
            const result =  await this.userService.updateActiveAccount(data.user_id,{
                is_active: true,
            })
           return result;
       }catch (err){
            throw console.log(`Can't active`);
       }
    }

    // validate Account
    async validateAccount(email : string, password : string) : Promise<any>{
       try {
           const account: UserEntity = await this.userService.getByEmail(email);
           if(account && account.isPasswordValid(password)){
               const { password, ...result} = account
               return result
           }
           return null
       }catch (err){
           console.log('errors',err);
           throw new HttpException('Invalid account or password',HttpStatus.INTERNAL_SERVER_ERROR);
       }
    }

    // login
    async LoginAccount(_data : BodyLogin) : Promise<any>{
        try {
        const data : UserEntity = await this.userService.getByEmail(_data.email);
        const payload ={
            email : data.email,
            id : data.user_id,
            role : data.roleEntity
        }

        const jwtToken = this.jwtService.sign(payload)

        return{
            access_token : jwtToken,
        }

        }catch (err) {
            throw console.log(`Failed`);
        }
    }

}