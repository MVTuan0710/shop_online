import {HttpException, Injectable,HttpStatus} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {CreateUserLogDTO} from "./user-log.dto";
import {UserLogEntity} from "./user-log.entity";

@Injectable()
export class UserLogService{
    public userLogEntity = new UserLogEntity();
    constructor(@InjectRepository(UserLogEntity)
                private readonly userLogRepository: Repository<UserLogEntity>
    ){}

    async getAll(): Promise<UserLogEntity[]> {
        try{
            return await this.userLogRepository.find();
        }catch(err){
            console.log(err);
            throw new HttpException('failed', 500);
        }
        
    }

    async create(data: CreateUserLogDTO): Promise<any> {
        try{
            await this.userLogRepository.save(data);
        }catch(err){
            console.log(err);
            throw new HttpException('failed', 500);
        }
    }
}