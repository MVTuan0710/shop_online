import {HttpException, Injectable,HttpStatus} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import { CreateItemLogDTO } from "./item_log.dto";
import { ItemLogEntity } from "./item_log.entity";

@Injectable()
export class ItemLogService{
    constructor(@InjectRepository(ItemLogEntity) 
        private readonly itemLogRepository: Repository<ItemLogEntity>
    ){}

    async getAll(): Promise<ItemLogEntity[]> {
        try{
            return await this.itemLogRepository.find();
            
        }catch(err){
            console.log(err);
            throw new HttpException('Bad req',HttpStatus.BAD_REQUEST);
        }
      }

    async create(data: CreateItemLogDTO): Promise<any> {
        try{
           await this.itemLogRepository.save(data);

        }catch(err){
            console.log(err);
            throw new HttpException('Bad req',HttpStatus.BAD_REQUEST);
        }
    }
}