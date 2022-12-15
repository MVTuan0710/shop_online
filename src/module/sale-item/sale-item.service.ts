import {HttpException, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import { SaleItemEntity } from "./sale-item.entity";
import {Repository} from "typeorm";
import { CreateSaleItemDTO} from "./sale-item.dto";
import { ItemService } from "../item/item.service";
import { SaleLogEntity } from "../sale-log/sale-log.entity";
import { SaleService } from "../sale/sale.service";

@Injectable()
export class SaleItemService {

    constructor(@InjectRepository(SaleItemEntity) 
        private readonly saleItemRepository: Repository<SaleItemEntity>,
        private readonly itemService: ItemService,
        private readonly saleService: SaleService
    ) {}

    // find sale-item by id
    async getById(sale_item_id: string): Promise<SaleItemEntity> {
        try{
            const result = await this.saleItemRepository.findOne({
                where: {sale_item_id: sale_item_id},
                relations: { saleEntity : true , itemEntity: true}
            });
            return result;
        
        }catch(err){
            console.log("errors",err);
            throw new HttpException('Bad req',400);
        }
    }

    async updateByOder(sale_item_id: string, amount: number): Promise<any>{
        try{
            const sale_item = await this.saleItemRepository.findOne({where:{sale_item_id: sale_item_id}});
            const tmp = sale_item.amount - amount;
            sale_item.amount = tmp;
            
            await this.saleItemRepository.update(sale_item_id,sale_item);
        }catch(err){
            console.log("errors",err);
            throw new HttpException('Bad req',400);
        }
    }

    // Find All sale-item
    async find(): Promise<SaleItemEntity[]> {
        try{
            const result = await this.saleItemRepository.find({
                // relations: { saleEntity : true , itemEntity: true}
            });
            return result;
        
        }catch(err){
            console.log("errors",err);
            throw new HttpException('Bad req',400);
        }
        
    }
    
    // create sale
    async create(data: CreateSaleItemDTO): Promise<any> {
        try {
           // find voucher_code
           const item = await this.itemService.getByIdNormal(data.item_id);
           const sale = await this.saleService.getById(data.sale_id);
            
            if (!item){
                throw new HttpException('Not Found',404);
            };
            
            if (!sale){
                throw new HttpException('Not Found',404);
            };
            
            // save sale-item
            const saleItemEntity = new SaleItemEntity();
            saleItemEntity.amount = data.amount;
            saleItemEntity.itemEntity = item;
            saleItemEntity.saleEntity = sale;

            const result = await this.saleItemRepository.save(saleItemEntity);
            return result;

        }catch(err){
            console.log("errors",err);
            throw new HttpException('Bad req',400);
        }
    }
    
    // update sale-item
    async update(sale_item_id : string, data: CreateSaleItemDTO): Promise<any> {
       try {
        // check sale-item, item, sale
            const sale_item =  await this.saleItemRepository.findOne({where: {sale_item_id: sale_item_id}})
            const item = await this.itemService.getByIdNormal(data.item_id);
            const sale = await this.saleService.getById(data.sale_id);
            
            if (!sale_item){
                throw new HttpException('Not Found',404);
            };
            
            if (!item){
                throw new HttpException('Not Found',404);
            };
            
            if (!sale){
                throw new HttpException('Not Found',404);
            };
            
            const saleItemEntity = new SaleItemEntity();
            saleItemEntity.amount = data.amount;
            saleItemEntity.itemEntity = item;
            saleItemEntity.saleEntity = sale;

            // update sale-item
            await this.saleItemRepository.update(sale_item_id,saleItemEntity);
            const result =  await this.saleItemRepository.findOne({where: {sale_item_id: sale_item_id}})
            return result;
       }catch (err){
           console.log('error',err);
           throw new HttpException('Bad req',400);
       }
    }

    // delete sale-item
    async delete(sale_item_id : string): Promise<any> {
        try {
            // find sale-item
            const sale_item = await this.saleItemRepository.findOne({where: {sale_item_id:sale_item_id}});
            
            if (!sale_item){
                throw new HttpException('Not Found',500);
            }
            
            // delete sale-item
            const result = await this.saleItemRepository.delete(sale_item_id);
            return result;
        }catch (err){
            console.log('errors',err);
            throw new HttpException('Bad req',400);
        }
    }
}