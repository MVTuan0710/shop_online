import {HttpException, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {ShippingLogEntity} from "./shipping-log.entity";
import {CreateShippngLogDTO} from "./shipping-log.dto";

@Injectable()
export class ShippingLogService{
    public itemLogEntity = new ShippingLogEntity();
    constructor(@InjectRepository(ShippingLogEntity)
                private readonly shippingLogRepository: Repository<ShippingLogEntity>
    ){}

    async getAll(): Promise<ShippingLogEntity[]> {
        
        try{
            return await this.shippingLogRepository.find();
        }catch(err){
            console.log(err);
            throw new HttpException('failed', 500);
        }
    }

    async create(data: CreateShippngLogDTO): Promise<any> {
       

        try{
            await this.shippingLogRepository.save(data);
        }catch(err){
            console.log(err);
            throw new HttpException('failed', 500);
        }
    }
}