import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "./user.entity";
import {DeleteResult, Repository, UpdateResult} from "typeorm";
import {CreateAccountDTO, BodyActiveAccount, BodyGetOneAccount} from "../users/user.dto";
import {RoleService} from "../role/role.service";
import {v4 as uuidv4} from 'uuid';
import {hashSync} from 'bcryptjs';
import {JwtService} from "@nestjs/jwt";
import { UserLogEntity } from "../user-log/user-log.entity";
import { UserLogService } from "../user-log/user-log.service";
import { RoleEntity } from "../role/role.entity";



@Injectable()
export class UserService {
    public userEntity = new UserEntity();
    constructor(@InjectRepository(UserEntity) 
        private readonly userRepository: Repository<UserEntity>,
                
        private readonly roleService: RoleService,
                
        private readonly jwtService : JwtService,
                
        private readonly userLogService: UserLogService,

    ) {}
   
    // Cau 6
    async getOne(data: BodyGetOneAccount): Promise<UserEntity> {
    try{
        const user = await this.userRepository.findOne({where: {email: data.email}})
    
        if(user.roleEntity.role_id === 1|| user.roleEntity.role_id === 1){

            const account = await this.userRepository.findOne({
                where: {name: data.name, phone: data.phone}
            });
            delete account.password;
            return account;

        }else{

            if(user.roleEntity.role_id === 1){
                const account = await this.userRepository.findOne({
                    where: {name: data.name, phone: data.phone}
                });
                delete account.user_id;
                delete account.email;
                delete account.roleEntity;
                delete account.is_active;
                delete account.password;
                delete account.verify_token;
                return account;
            }
        }

    }catch(err){
        throw console.log("failed");
    }
}


    // Find All
    async find(): Promise<UserEntity[]> {
        try{
            const accounts = await this.userRepository.find({
                relations: {roleEntity : true}
            });
            return accounts;

        }catch(err){
            throw err;
        }
        
    }

    async getById(user_id : string): Promise<UserEntity> {
        const accounts = await this.userRepository.findOne({
            where: {user_id: user_id }, 
            relations: { roleEntity : true }
        })
        delete accounts.password;
        return accounts;
    }

    // find by email
    async getByEmail(email: string): Promise<UserEntity> {
        const accounts = await this.userRepository.findOne({
            where: {email: email },
            relations: { roleEntity : true }
        });

        delete accounts.password;
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
            relations: { roleEntity : true }
        })
    }

    // create account
    async createAccount(data: CreateAccountDTO, token : any): Promise<UserEntity> {
        try {
            // check email exists
            const email: UserEntity  = await this.userRepository.findOne({where : {email :data.email}});
            if (email){
                throw console.log('The account is not found');
            }

                const _token = token.authorization.split(" ");
                const payload = this.jwtService.verify(_token[1]); 
    
                if(payload.role.role_id === 1){
                    if(data.role_id === 3 || data.role_id === 2){
    
                    const role = await this.roleService.findById(data.role_id);
    
                    const userEntity = new UserEntity();
                    userEntity.email = data.email;
                    userEntity.name = data.name;
                    userEntity.password = hashSync(data.password, 6);
                    userEntity.phone = data.phone;
                    userEntity.roleEntity = role;
                    userEntity.verify_token = uuidv4();
    
                    const result = await this.userRepository.save(userEntity);

                    const userLogEntity = new UserLogEntity();
                    userLogEntity.email = result.email;
                    userLogEntity.phone = result.phone;
                    userLogEntity.name = result.name;
                    userLogEntity.userEntity = result;
            
                    await this.userLogService.create(userLogEntity );
                    return result;
    
                    }else{
                        throw console.log("failed");
                    }
                }else{

                    if(payload.role.role_id === 4 && data.role_id === 4){
                
                        const role = await this.roleService.findById(data.role_id);
        
                        const userEntity = new UserEntity();
                        userEntity.email = data.email;
                        userEntity.name = data.name;
                        userEntity.password = hashSync(data.password, 6);
                        userEntity.phone = data.phone;
                        userEntity.roleEntity = role;
                        userEntity.verify_token = uuidv4();
        
                        const result = await this.userRepository.save(userEntity);

                        const userLogEntity = new UserLogEntity();
                        userLogEntity.email = result.email;
                        userLogEntity.phone = result.phone;
                        userLogEntity.name = result.name;
                        userLogEntity.userEntity = result;
                
                        await this.userLogService.create(userLogEntity );
                        return result;
        
                    }else{
                            throw console.log("failed");
                    }
                }
            
            
        }catch(err){
            console.log("errors",err);
             throw console.log('Can`t create Account');
        }
    }
    
    async register(data: CreateAccountDTO): Promise<UserEntity> {
        try {
                // if(data.role_id === 4){
                // check email exists
                const email: UserEntity  = await this.userRepository.findOne({where : {email :data.email}});
                if (email){
                    throw console.log('The account is exist');
                }
    
                const role = await this.roleService.findById(data.role_id);
            
                const userEntity = new UserEntity();
                userEntity.email = data.email;
                userEntity.name = data.name;
                userEntity.password = hashSync(data.password, 6);
                userEntity.phone = data.phone;
                userEntity.roleEntity = role;
                userEntity.verify_token = uuidv4();
    
                const result = await this.userRepository.save(userEntity);

                const userLogEntity = new UserLogEntity();
                userLogEntity.email = result.email;
                userLogEntity.name = result.name;
                userLogEntity.phone = result.phone;
                userLogEntity.userEntity = result; 

                await this.userLogService.create(userLogEntity);

                return result;  
        }catch(err){
            console.log("errors",err);
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
    async updateTokenAccount(user_id : string, data: CreateAccountDTO): Promise<UpdateResult> {
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

    // update Account
    async updateAccount(user_id : string, data: CreateAccountDTO): Promise<UpdateResult> {
       try {
           // check account exists
           const account = await this.userRepository.findOne({where : {user_id : user_id}});
           if (!account)
               throw console.log('Can`t found Account by account_id');

            const role = await this.roleService.findById(data.role_id);
            
                const userEntity = new UserEntity();
                userEntity.email = data.email;
                userEntity.name = data.name;
                userEntity.password = hashSync(data.password, 6);
                userEntity.phone = data.phone;
                userEntity.roleEntity = role;
                userEntity.verify_token = uuidv4();
    
            // update account
           const result = await this.userRepository.update(user_id, userEntity);

           const user = await this.userRepository.findOne({where:{user_id: user_id}});

                const userLogEntity = new UserLogEntity();
                userLogEntity.email = data.email;
                userLogEntity.name = data.name;
                userLogEntity.phone = data.phone;
                userLogEntity.userEntity = user; 

                await this.userLogService.create(userLogEntity);
           return result;
       }catch (err){
           
        console.log('error',err);
           throw console.log('Can`t update Account');
       }
    }

    // delete Acount
    async deleteAccount(user_id : string, token: any): Promise<DeleteResult> {
        try {
              // check account exists
            const Account = await this.userRepository.findOne({where : {user_id : user_id}});
            if (!Account)
                throw console.log('Can`t found Account by account_id');
        

            const _token = token.authorization.split(" ");
            const payload = this.jwtService.verify(_token[1]); 

            const data = await this.userRepository.findOne({
                where : {user_id :user_id},
                relations: { roleEntity : true }
            });

            if(payload.role.role_id === 1){
                if(data.roleEntity.role_id === 3 || data.roleEntity.role_id === 2){

                    const result = await this.userRepository.delete(user_id);
                    console.log(result);
                    
                    return result;

                }else{
                    throw console.log("failed");
                }
            }
          
        }catch (err){
            console.log('errors',err);
            throw console.log('Can`t delete Account');
        }
    }
}