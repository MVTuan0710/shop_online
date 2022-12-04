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
        return await this.wareHouseLogRepository.find()
    }

    async create(data: CreateWareHouseLogDTO): Promise<any> {
        await this.wareHouseLogRepository.save(data)
    }
}