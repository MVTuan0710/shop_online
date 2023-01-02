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

    // register
    async register(data : CreateAccountDTO) : Promise<UserEntity>{
        try {
            const user = await this.userService.getByEmail(data.email);
            if(user){
                throw new HttpException('Email is exists',HttpStatus.BAD_REQUEST);
            }

            const result: UserEntity =  await this.userService.register(data);
            return result;

        }catch (err){
            console.log(err);
            throw new HttpException('Bad req',HttpStatus.BAD_REQUEST);
        }
    }

    // verify token
    async verifyAccount(token : string) : Promise<UserEntity>{
       try {
           const data: UserEntity = await this.userService.getByVerifyToken(token);
            if(!data){
                throw new HttpException('The account is not exists',HttpStatus.BAD_REQUEST);
            }
            if(data.is_active == true){
                throw new HttpException('The account is activated',HttpStatus.BAD_REQUEST);
            }

            const result =  await this.userService.updateActiveAccount(data.user_id,{
                is_active: true,
            })
           return result;

       }catch (err){
            console.log(err);
            throw new HttpException('Bad req',HttpStatus.BAD_REQUEST);
       }
    }

    // validate Account
    async validateAccount(email : string, password : string) : Promise<any>{
        try {
            const account: UserEntity = await this.userService.getByEmail(email);
            if(account && account.isPasswordValid(password)){
               const { password, ...result} = account;
               return result;
            }
            return null;

        }catch (err){
           console.log(err);
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
            console.log(err);
            throw new HttpException('Invalid account or password',HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}