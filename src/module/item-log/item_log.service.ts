import {HttpException, Injectable,HttpStatus} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository, UpdateDateColumn} from "typeorm";
import { CreateItemLogDTO } from "./item_log.dto";
import { ItemLogEntity } from "./item_log.entity";

@Injectable()
export class ItemLogService{
    public itemLogEntity = new ItemLogEntity();
    constructor(@InjectRepository(ItemLogEntity) 
        private readonly itemLogRepository: Repository<ItemLogEntity>
    ){}

    async getAll(): Promise<ItemLogEntity[]> {
        return await this.itemLogRepository.find()
      }

    async create(data: CreateItemLogDTO): Promise<any> {
        await this.itemLogRepository.save(data)
    }
}