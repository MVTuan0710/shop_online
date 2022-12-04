import {HttpException, Injectable,HttpStatus} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {CreateOderDetailLogDTO} from "./oder-detail.dto";
import {OderDetailLogEntity} from "./oder-detail-log.entity";

@Injectable()
export class OderDetailLogService{
    public oderDetailLogEntity = new OderDetailLogEntity();
    constructor(@InjectRepository(OderDetailLogEntity)
                private readonly oderDetailLogRepository: Repository<OderDetailLogEntity>
    ){}

    async getAll(): Promise<OderDetailLogEntity[]> {
        return await this.oderDetailLogRepository.find()
    }

    async create(data: CreateOderDetailLogDTO): Promise<any> {
        await this.oderDetailLogRepository.save(data)
    }
}