import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {OderDetailEntity} from "./oder-detail.entity";
import { QueryRunner, Repository} from "typeorm";
import {CreateOderDetailDTO, UpdateOderDetailDTO} from "./oder-detail.dto";
import { ItemService } from "../item/item.service";
import { OderEntity } from "../oder/oder.entity";
import { OderDetailLogEntity } from "../oder-detial-log/oder-detail-log.entity";
import { SaleItemService } from "../sale-item/sale-item.service";
import { GetSaleItemDTO } from "../sale/sale.dto";


@Injectable()
export class OderDetailService {
    public oderDetailEntity = new OderDetailEntity();
    constructor(
        @InjectRepository(OderDetailEntity) 
        private readonly oderDetailRepository: Repository<OderDetailEntity>,
        
        private readonly itemService: ItemService,

        private readonly saleItemService: SaleItemService
    ) {}

    //find oder-detail by id
    async getById(oder_detail_id: string): Promise<OderDetailEntity> {
        try{
            const result = await this.oderDetailRepository.findOne({
                where: {oder_detail_id: oder_detail_id },
                relations: { oderEntity : true }
            });
            return result;

        }catch(err){
            console.log(err);
            throw new HttpException('Bad req',HttpStatus.BAD_REQUEST);
        }
    }
    async getByOderId(oder_id: string,  queryRunner: QueryRunner): Promise<OderDetailEntity[]> {
        try{    
            const result = await queryRunner.manager.find(OderDetailEntity,{
                where: { 
                oderEntity: {oder_id: oder_id}
                },
                relations: { oderEntity : true }
            });
            return result;

        }catch(err){
            console.log(err);
            throw new HttpException('Bad req',HttpStatus.BAD_REQUEST);
        }
    }

    // Find All oder-detail
    async find(): Promise<OderDetailEntity[]> {
        try{
            const data = await this.oderDetailRepository.find({
                 relations: { oderEntity : true }
            });
            return data;

        }catch(err){
            console.log(err);
            throw new HttpException('Bad req',HttpStatus.BAD_REQUEST);
        } 
    }

    // create oder-detail
    async create (data: OderEntity, queryRunner: QueryRunner): Promise<any> {
        try{
            for(let i = 0; i< data.oderDetailEntity.length; i++){
                const new_oder_detail = new OderDetailEntity();
                new_oder_detail.oderEntity = data;
                new_oder_detail.ware_house_id = data.oderDetailEntity[i].ware_house_id;
                new_oder_detail.item_id = data.oderDetailEntity[i].item_id;
                new_oder_detail.item_info = data.oderDetailEntity[i].item_info;
                new_oder_detail.oder_price = data.oderDetailEntity[i].oder_price;
                new_oder_detail.origin_price = data.oderDetailEntity[i].origin_price;
                new_oder_detail.quantity = data.oderDetailEntity[i].quantity;
                const oder_detail = await queryRunner.manager.save(OderDetailEntity, new_oder_detail);

                const new_oder_detail_log = new OderDetailLogEntity();
                new_oder_detail_log.oderDetailEntity = oder_detail;
                new_oder_detail_log.item_info = oder_detail.item_info;
                new_oder_detail_log.oder_price = oder_detail.oder_price;
                new_oder_detail_log.origin_price = oder_detail.origin_price;
                new_oder_detail_log.quantity = oder_detail.quantity;

                await queryRunner.manager.save(OderDetailLogEntity, new_oder_detail_log);
                
            }
            

            const result = await this.oderDetailRepository.save(data);
            return result;

        }catch(err){
            console.log(err);
            throw new HttpException('Bad req',HttpStatus.BAD_REQUEST);
        }
    }

    async createForStaff(oder : OderEntity,queryRunner: QueryRunner): Promise<any>{
        let result:OderDetailEntity[] = [];
        for(let i = 0; i < oder.oderDetailEntity.length; i++){
            const item = await this.itemService.getByIdNormal(oder.oderDetailEntity[i].item_id);

            const new_oder_detail = new OderDetailEntity();
            new_oder_detail.item_id = oder.oderDetailEntity[i].item_id;
            // new_oder_detail.oderEntity = oder;
            new_oder_detail.ware_house_id = oder.oderDetailEntity[i].ware_house_id;
            new_oder_detail.quantity = oder.oderDetailEntity[i].quantity;
            new_oder_detail.origin_price = item.price * oder.oderDetailEntity[i].quantity;
            new_oder_detail.oder_price = new_oder_detail.origin_price - ((new_oder_detail.origin_price/100)*20);
            new_oder_detail.item_info = JSON.stringify(item);
            

            result.push(new_oder_detail);
    
        } 
        return result;
    }

    async createForCustomer(oder : OderEntity,queryRunner: QueryRunner): Promise<any>  {
        try{
            let result:OderDetailEntity[] = [];
            for(let i = 0; i < oder.oderDetailEntity.length; i++){
                const item = await this.itemService.getByIdNormal(oder.oderDetailEntity[i].item_id);

                let origin_price = item.price * oder.oderDetailEntity[i].quantity;
                let oder_price = 0;
                
                if(oder.voucher_code){
                    const get_sale_item = new GetSaleItemDTO();
                    get_sale_item.item_id = oder.oderDetailEntity[i].item_id;
                    get_sale_item.voucher_code = oder.voucher_code;

                    const sale_item = await this.saleItemService.getByOderDetail(get_sale_item);
              
                    if(sale_item){
                        
                        if(sale_item.amount - oder.oderDetailEntity[i].quantity < 0){
                            
                            // use voucher
                            const new_oder_detail = new OderDetailEntity();
                            new_oder_detail.item_id = oder.oderDetailEntity[i].item_id;
                            new_oder_detail.oderEntity = oder;
                            new_oder_detail.ware_house_id = oder.oderDetailEntity[i].ware_house_id;
                            new_oder_detail.quantity = sale_item.amount;
                            new_oder_detail.oder_price = (sale_item.amount * item.price) - ( sale_item.amount*sale_item.saleEntity.value);
                            new_oder_detail.origin_price = sale_item.amount * item.price;
                            new_oder_detail.item_info = JSON.stringify(item);

                            result.push(new_oder_detail);
                            
                            // can't use voucher
                            const _new_oder_detail = new OderDetailEntity();
                            _new_oder_detail.item_id = oder.oderDetailEntity[i].item_id;
                            _new_oder_detail.oderEntity = oder;
                            new_oder_detail.ware_house_id = oder.oderDetailEntity[i].ware_house_id;
                            _new_oder_detail.quantity = oder.oderDetailEntity[i].quantity - sale_item.amount;
                            _new_oder_detail.oder_price = (oder.oderDetailEntity[i].quantity - sale_item.amount) * item.price;
                            _new_oder_detail.origin_price = (oder.oderDetailEntity[i].quantity - sale_item.amount)* item.price;
                            _new_oder_detail.item_info = JSON.stringify(item);

                            sale_item.amount = 0;
                            result.push(new_oder_detail);
                            continue;
                        }
                        if(sale_item.amount - oder.oderDetailEntity[i].quantity >= 0){
                            oder_price = origin_price - (oder.oderDetailEntity[i].quantity * sale_item.saleEntity.value);
                        }
                    }
                    if(!sale_item){
                        oder_price = origin_price;
                    }
                }
                if(!oder.voucher_code){
                    oder_price = origin_price;
                }
                

                const new_oder_detail = new OderDetailEntity();
                new_oder_detail.item_id = oder.oderDetailEntity[i].item_id;
                new_oder_detail.oderEntity = oder;
                new_oder_detail.quantity = oder.oderDetailEntity[i].quantity;
                new_oder_detail.ware_house_id = oder.oderDetailEntity[i].ware_house_id;
                new_oder_detail.oder_price = oder_price;
                new_oder_detail.origin_price = origin_price;
                new_oder_detail.item_info = JSON.stringify(item);

                result.push(new_oder_detail);
            }
            return result;
        }catch(err){
            console.log(err);
            throw new HttpException('Bad req',HttpStatus.BAD_REQUEST);
        }
    }
    
    async update(data: UpdateOderDetailDTO) {
        try{
            const oder_detail = await this.oderDetailRepository.findOne({where : {oder_detail_id : data.oder_detail_id}});
            if (!oder_detail){
                throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
            }

            const result = await this.oderDetailRepository.update(data.oder_detail_id,data)
            return result;

        }catch(err){
            console.log(err);
            throw new HttpException('Bad req',HttpStatus.BAD_REQUEST);
        }
   }

    // delete 
    async delete(oder_detail_id : string): Promise<any> {
        try {
            // check oder detail exists
            const oder_detail = await this.oderDetailRepository.findOne({where : {oder_detail_id : oder_detail_id}});
            if (!oder_detail){
                throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
            }
            
            // delete 
            await this.oderDetailRepository.delete(oder_detail_id);
            return oder_detail;

        }catch (err){
            console.log(err);
            throw new HttpException('Bad req',HttpStatus.BAD_REQUEST);
        }
    }
}