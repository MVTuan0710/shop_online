import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import { SaleItemEntity } from "./sale-item.entity";
import { MoreThan, Raw, QueryRunner, Repository} from "typeorm";
import { CreateSaleItemDTO} from "./sale-item.dto";
import { ItemService } from "../item/item.service";
import { SaleService } from "../sale/sale.service";
import { OderDetailEntity } from "../oder-detail/oder-detail.entity";
import { GetSaleItemDTO } from "../sale/sale.dto";
import { OderEntity } from "../oder/oder.entity";
import { SaleEntity } from "../sale/sale.entity";


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
            console.log(err);
            throw new HttpException('Bad req',HttpStatus.BAD_REQUEST);
        }
    }

    async updateByOder(sale_item_id: string, amount: number): Promise<any>{
        try{
            const sale_item = await this.saleItemRepository.findOne({where:{sale_item_id: sale_item_id}});
            const tmp = sale_item.amount - amount;
            sale_item.amount = tmp;
            
            await this.saleItemRepository.update(sale_item_id,sale_item);

        }catch(err){
            console.log(err);
            throw new HttpException('Bad req',HttpStatus.BAD_REQUEST);
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
            console.log(err);
            throw new HttpException('Bad req',HttpStatus.BAD_REQUEST);
        }
        
    }
    async getByOderDetail(data: GetSaleItemDTO):Promise<SaleItemEntity>{
        try{
            const sale_item =  await this.saleItemRepository.findOne({
                where:[
                    {
                        itemEntity: {item_id: data.item_id},
                        saleEntity: {
                            voucher_code: data.voucher_code, 
                            start_date: Raw((alias) => `${alias} < NOW()`),
                            end_date: Raw((alias) => `${alias} > NOW()`),
                        },
                        amount : MoreThan(0),
                    
                    },
                    {
                        itemEntity: {item_id: data.item_id},
                        saleEntity: {
                            voucher_code: data.voucher_code, 
                            start_date: Raw((alias) => `${alias} < NOW()`),
                            end_date: null,
                        },
                        amount : MoreThan(0),
                    
                    }
                ], 
                relations: {
                    itemEntity: true,
                    saleEntity: true
                }
            });
            return sale_item;

        }catch(err){
            console.log(err);
            throw new HttpException('Bad req',HttpStatus.BAD_REQUEST);
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
            console.log(err);
            throw new HttpException('Bad req',HttpStatus.BAD_REQUEST);
        }
    }
    async updateSaleItemByCancelOder(oder: OderEntity, queryRunner: QueryRunner):Promise<any>{
        try{
            for(let i = 0; i < oder.oderDetailEntity.length; i++){
                if(oder.oderDetailEntity[i].oder_price != oder.oderDetailEntity[i].origin_price){
                    const sale_item =  await this.saleItemRepository.findOne({
                        where: {
                            itemEntity: {item_id: oder.oderDetailEntity[i].item_id},
                            saleEntity: {voucher_code: oder.voucher_code}
                        }
                    });
                    let new_sale_item = new SaleItemEntity();
                    new_sale_item = sale_item;
                    new_sale_item.amount = sale_item.amount + oder.oderDetailEntity[i].quantity;
                    
                    await queryRunner.manager.update(SaleItemEntity,sale_item.sale_item_id,new_sale_item);
                }
            }
            return 0;
            
        }catch(err){
            console.log(err);
            throw new HttpException('Bad req',HttpStatus.BAD_REQUEST);
        }
       
    }
    async updateSaleItemByCreateOder(voucher_code: string, oder_item:OderDetailEntity[], queryRunner: QueryRunner):Promise<any>{
        try{
            for(let i = 0; i< oder_item.length; i++){
                const sale_item =  await this.saleItemRepository.findOne({
                    where: {
                        itemEntity: {item_id: oder_item[i].item_id},
                        saleEntity: {voucher_code: voucher_code}
                    }
                });
                if(sale_item){
                    let new_sale_item = new SaleItemEntity();
                    new_sale_item = sale_item;
                    if(new_sale_item.amount >= oder_item[i].quantity){
                        new_sale_item.amount = new_sale_item.amount - oder_item[i].quantity;
                    }
                    if(new_sale_item.amount < oder_item[i].quantity){
                        new_sale_item.amount = 0; 
                    }
                    await queryRunner.manager.update(SaleItemEntity,sale_item.sale_item_id,new_sale_item);
                }
            }

        }catch(err){
            console.log(err);
            throw new HttpException('Bad req',HttpStatus.BAD_REQUEST);
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
            console.log(err);
            throw new HttpException('Bad req',HttpStatus.BAD_REQUEST);
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
            console.log(err);
            throw new HttpException('Bad req',HttpStatus.BAD_REQUEST);
        }
    }
}