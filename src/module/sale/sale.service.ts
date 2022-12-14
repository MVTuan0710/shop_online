import {HttpException, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import { SaleEntity } from "./sale.entity";
import {Repository} from "typeorm";
import { CreateSaleDTO} from "./sale.dto";
import { SaleLogService } from "../sale-log/sale-log.service";
import { SaleLogEntity } from "../sale-log/sale-log.entity";

@Injectable()
export class SaleService {
    constructor(@InjectRepository(SaleEntity) 
        private readonly saleRepository: Repository<SaleEntity>,
        private readonly saleLogService: SaleLogService, 
   
    ) {}

    // find sale by id
    async getById(sale_id: string): Promise<SaleEntity> {
        try{
            const result = await this.saleRepository.findOne({
                where: {sale_id: sale_id},
                relations: { saleLogEntity : true }
            });
            return result;
        }catch(err){
            console.log("errors",err);
            throw new HttpException('Bad req',400);
        }
    }

    async getByCode(voucher_code: string): Promise<SaleEntity> {
        try{
            const result = await this.saleRepository.findOne({
                where: {voucher_code: voucher_code},
                relations: { saleLogEntity : true }
            });
            return result;
        }catch(err){
            console.log("errors",err);
            throw new HttpException('Bad req',400);
        }
    }

    // Find All sale
    async find(): Promise<SaleEntity[]> {
        try{
            const result = await this.saleRepository.find({
                // relations: { saleLogEntity : true }
            });
            return result;
        }catch(err){
            console.log("errors",err);
            throw new HttpException('Bad req',400);
        }
        
    }
    
    // create sale
    async create(data: CreateSaleDTO): Promise<any> {
        try {
           // find voucher_code
            const voucher_code  = await this.saleRepository.findOne({
                where: {voucher_code: data.voucher_code}
            });
            
            if (voucher_code){
                throw new HttpException('Voucher already exist',400);
            };

            // save sale
            const result = await this.saleRepository.save(data);
            
            // map data saleEntity -> saleLogEntity
            const saleLogEntity = new SaleLogEntity();
            saleLogEntity.name = result.name;
            saleLogEntity.voucher_code = result.voucher_code;
            saleLogEntity.value = result.value;
            saleLogEntity.start_date = result.start_date;
            saleLogEntity.end_date = result.end_date;
           
            // ghi log cua sale
            await this.saleLogService.create(saleLogEntity);
            return result;

        }catch(err){
            console.log("errors",err);
            throw new HttpException('Bad req',400);
        }
    }
    
    // update sale
    async update(sale_id : string, data: CreateSaleDTO): Promise<any> {
       try {
           // find sale
           const sale  = await this.saleRepository.findOne({where: {sale_id:sale_id}});
           if (!sale){
                throw new HttpException('Not Found',500);
           }
            // update sale
            const result = await this.saleRepository.update(sale_id,data);
            return result;
       }catch (err){
           console.log('error',err);
           throw new HttpException('Bad req',400);
       }
    }

    // delete sale
    async delete(sale_id : string): Promise<any> {
        try {
            // find sale
            const sale  = await this.saleRepository.findOne({where: {sale_id:sale_id}});
           if (!sale){
                throw new HttpException('Not Found',500);
           }
            // delete sale
            const result = await this.saleRepository.delete(sale_id);
            return result;
        }catch (err){
            console.log('errors',err);
            throw new HttpException('Bad req',400);
        }
    }
}