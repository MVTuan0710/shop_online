import {HttpException, Injectable,HttpStatus} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import { CreateSaleLogDTO } from "./sale-log.dto";
import { SaleLogEntity } from "./sale-log.entity";

@Injectable()
export class SaleLogService{
    public saleLogEntity = new SaleLogEntity();
    constructor(@InjectRepository(SaleLogEntity)
                private readonly saleLogRepository: Repository<SaleLogEntity>
    ){}

    async getAll(): Promise<SaleLogEntity[]> {
        try{
            return await this.saleLogRepository.find()
        }catch(err){
            console.log(err);
            throw new HttpException('failed', 500)
        }
    }

    async create(data: CreateSaleLogDTO): Promise<any> {
        try{
            await this.saleLogRepository.save(data)
        }catch(err){
            console.log(err);
            throw new HttpException('failed', 500)
        }
    }
}