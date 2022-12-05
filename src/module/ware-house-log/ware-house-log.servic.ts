import {HttpException, Injectable,HttpStatus} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {CreateWareHouseLogDTO} from "./ware-house-log.dto";
import {WareHouseLogEntity} from "./ware-house-log.entity";

@Injectable()
export class WareHouseLogService{
    public wareHouseLogEntity = new WareHouseLogEntity();
    constructor(@InjectRepository(WareHouseLogEntity)
                private readonly wareHouseLogRepository: Repository<WareHouseLogEntity>
    ){}

    async getAll(): Promise<WareHouseLogEntity[]> {
        try{
            return await this.wareHouseLogRepository.find();
        }catch(err){
            console.log(err);
            throw new HttpException('failed', 500);
        }
        
    }

    async create(data: CreateWareHouseLogDTO): Promise<any> {
        
        try{
            await this.wareHouseLogRepository.save(data);
        }catch(err){
            console.log(err);
            throw new HttpException('failed', 500);
        }
    }
}