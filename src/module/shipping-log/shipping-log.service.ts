import {Injectable} from "@nestjs/common";
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
        return await this.shippingLogRepository.find()
    }

    async create(data: CreateShippngLogDTO): Promise<any> {
        await this.shippingLogRepository.save(data)
    }
}