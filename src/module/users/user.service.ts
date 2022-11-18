import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "./user.entity";
import {Repository} from "typeorm";
import {CreateAccountDTO, BodyActiveAccount} from "../users/user.dto";
// import {RoleService} from "../role/role.service";
import {v4 as uuidv4} from 'uuid';
import * as bcrypt from 'bcryptjs'
import {hashSync} from 'bcryptjs'
// import {MailerService} from "@nestjs-modules/mailer";
// import { AppModule } from "../core/core.module"


@Injectable()
export class UserService {
    public userEntity = new UserEntity();
    constructor(@InjectRepository(UserEntity) 
        private readonly userRepository: Repository<UserEntity>,
                // private readonly roleService: RoleService,
                // private readonly mailerService: MailerService
    ) {}
    async getByUsername(email: string): Promise<UserEntity> {
        const accounts = await this.userRepository.findOne({where : {email :email}});
        // delete accounts.password;
        return accounts;
        throw new Error("Method not implemented.");
    }
    // Find All
    async find(): Promise<UserEntity[]> {
        const accounts = await this.userRepository.find({
            relations: ['role_entity']
        });
        console.log(accounts);
        return accounts;
    }

    // find by id
    async getAccountById(user_id : string): Promise<UserEntity> {
        const accounts = await this.userRepository.findOne({where : {user_id :user_id}});
        // delete accounts.password;
        return accounts;
    }

    // find by email
    async getAccountByEmail(_email : string): Promise<UserEntity> {
        console.log(_email)
        const accounts = await this.userRepository.findOne({where : {email :_email}});
        // delete accounts.password;
        return accounts;
    }


   
    // find verifyToken
    async getByVerifyToken(token : string) : Promise<UserEntity>{
        return this.userRepository.findOne({where : {verify_token : token}});
    }

    // find username and role
    async findByUsernameAndSelectRole(email : string) : Promise<UserEntity>{
        return this.userRepository.findOne({
            where : {email : email},
            // relations :['role'],
        })
    }

    // create account
    async createAccount(data: CreateAccountDTO): Promise<UserEntity> {
        try {
            // check email exists
            const email = await this.userRepository.findOne({where : {email :data.email}});
            if (email){
                throw console.log('The account is not found');
            }
            const _password = hashSync(data.password, 6);
            data.password= _password;
            //check role valid
            // const role = await this.roleService.findById(data.role);
            // if (!role || role.id === 2) {
            //     throw new HttpException('Role is incorrect', HttpStatus.NOT_FOUND);
            // }
            
            // create verify_token
            data.verify_token = uuidv4(); 
            
            // save account 
            const result = await this.userRepository.save(data);
            return result;
        }catch(err){
             throw console.log('Can`t create Account');
        }
    }
    

    async updateActiveAccount(user_id : string, data : BodyActiveAccount): Promise<any> {
        try {
            // check account exists
            const account = await this.userRepository.findOne({where : {user_id : user_id}});
            if (!account)
                throw console.log('The account is not found');

            // update account
            const result= await this.userRepository.update(user_id, data);
            return result;
        }catch (err){
            console.log('error',err);
            throw console.log('Can`t active Account');
        }
    }
    async updateTokenAccount(user_id : string, data: CreateAccountDTO): Promise<any> {
        try {
            // check account exists
            const account = await this.userRepository.findOne({where : {user_id : user_id}});
            if (!account)
                throw console.log('The account is not found');

            // update account
            const result = await this.userRepository.update(user_id, data);
            return result;
        }catch (err){
            console.log('error',err);
            throw console.log('Can`t update token Account');
        }
    }
    // create register
    async register(data: CreateAccountDTO): Promise<any> {
        try {
            // check email exists
            const email = await this.userRepository.findOne({where : {email : data.email}});
            if (email) {
                throw console.log('Can`t found Account by email');
            }

            // create
            // const role = await this.roleService.findById(data.role);
            // accountEntity.role = role;
            // accountEntity.verify_token = uuidv4();
            // accountEntity.allow_email = data.allow_email;

            //const result = await this.accountRepository.save(this.accountEntity);

            // const url = `${hostname}/auth/verify/${accountEntity.verify_token}`
            // this.mailerService.sendMail({
            //     from: '"Support Team" <tranvohoaian2k@gmail.com>',
            //     to: data.username,
            //     subject: 'Welcome to Food management App! Confirm your Email',
            //     template: './gmail', // `.hbs` extension is appended automatically
            //     context: {
            //         fullname : data.fullname,
            //         url
            //     }
            // })
            // return result;
        }catch (err){
            throw console.log('Can`t register Account');
        }

    }

    // update Account
    async updateAccount(user_id : string, data: CreateAccountDTO): Promise<any> {
       try {
           // check account exists
           const account = await this.userRepository.findOne({where : {user_id : user_id}});
           if (!account)
               throw console.log('Can`t found Account by account_id');

            //  check role valid
            //  const role = await this.roleService.findById(data.role);
            //      if (!role || role.id === 2) {
            //          throw new HttpException('Role is incorrect', HttpStatus.NOT_FOUND);
            //      }

            // update account
           const result = await this.userRepository.update(user_id, data);
           return result;
       }catch (err){
           console.log('error',err);
           throw console.log('Can`t update Account');
       }
    }

    // delete Acount
    async deleteAccount(user_id : string): Promise<any> {
        try {
            // check account exists
            const Account = await this.userRepository.findOne({where : {user_id : user_id}});
            if (!Account)
                throw console.log('Can`t found Account by account_id');

            // delete
            const result = await this.userRepository.delete(user_id);
            return result;
        }catch (err){
            console.log('errors',err);
            throw console.log('Can`t delete Account');
        }
    }
}