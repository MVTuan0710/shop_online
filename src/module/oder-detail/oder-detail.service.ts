import {HttpException, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {OderDetailEntity} from "./oder-detail.entity";
import {DataSource, QueryRunner, Repository} from "typeorm";
import {CreateOderDetailDTO, UpdateOderDetailDTO} from "./oder-detail.dto";
import { ItemService } from "../item/item.service";
import { OderEntity } from "../oder/oder.entity";
import { OderDetailLogEntity } from "../oder-detial-log/oder-detail-log.entity";
import { SaleItemService } from "../sale-item/sale-item.service";


@Injectable()
export class OderDetailService {
    public oderDetailEntity = new OderDetailEntity();
    constructor(
        @InjectRepository(OderDetailEntity) 
        private readonly oderDetailRepository: Repository<OderDetailEntity>, 
        private readonly dataSource: DataSource,   
        private readonly itemService: ItemService,
        private readonly saleItemService: SaleItemService, 
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
            throw new HttpException('failed', 500);
        }
    }
    async getByOderId(oder_id: string): Promise<OderDetailEntity[]> {
        try{
            const result = await this.oderDetailRepository.find({
                where: { 
                oderEntity: {oder_id: oder_id}
                },
                relations: { oderEntity : true }
            });
            return result;

        }catch(err){
            console.log(err);
            throw new HttpException('failed', 500);
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
            throw new HttpException('failed', 500);
        } 
    }

    // create oder-detail
    async create (data: CreateOderDetailDTO): Promise<any> {
        try{
            const result = await this.oderDetailRepository.save(data);
            return result;

        }catch(err){
            console.log(err);
            throw new HttpException('failed', 500);
        }
    }

   async createByOder(oder : OderEntity,queryRunner: QueryRunner): Promise<any>  {
        try{
            for(let i = 0; i < oder.oder_item.length; i++){
                const item = await this.itemService.getByIdNormal(oder.oder_item[i].item_id);

                const origin_price = item.price * oder.oder_item[i].quantity;
                let oder_price = 0;
                if(oder.voucher_code){
                    const sale_item = await this.saleItemService.getByOderDetail(oder.voucher_code,oder.oder_item[i].item_id);
                       
                    if(sale_item){
                        if(sale_item.amount - oder.oder_item[i].quantity >= 0){
                            oder_price = origin_price - sale_item.saleEntity.value;
                        }
                        if(sale_item.amount - oder.oder_item[i].quantity < 0){
                            // use voucher
                            const new_oder_detail = new OderDetailEntity();
                            new_oder_detail.item_id = oder.oder_item[i].item_id;
                            new_oder_detail.oderEntity = oder;
                            new_oder_detail.quantity = sale_item.amount;
                            new_oder_detail.oder_price = (sale_item.amount * item.price)- sale_item.saleEntity.value;
                            new_oder_detail.origin_price = origin_price;
                            new_oder_detail.item_info = item.toString();
            
                            const oder_detail = await queryRunner.manager.save(OderDetailEntity,new_oder_detail);
            
                            const new_oder_detail_log = new OderDetailLogEntity();
                            new_oder_detail_log.item_info = item.toString();
                            new_oder_detail_log.quantity =  new_oder_detail.quantity;
                            new_oder_detail_log.oder_price =  new_oder_detail.oder_price;
                            new_oder_detail_log.origin_price = new_oder_detail.origin_price;
                            new_oder_detail_log.oderDetailEntity = oder_detail;
            
                            await queryRunner.manager.save(OderDetailLogEntity,new_oder_detail);



                            // can't use voucher
                            const _new_oder_detail = new OderDetailEntity();
                            _new_oder_detail.item_id = oder.oder_item[i].item_id;
                            _new_oder_detail.oderEntity = oder;
                            _new_oder_detail.quantity = oder.oder_item[i].quantity - sale_item.amount;
                            _new_oder_detail.oder_price = ((oder.oder_item[i].quantity - sale_item.amount) * item.price)- sale_item.saleEntity.value;
                            _new_oder_detail.origin_price = origin_price;
                            _new_oder_detail.item_info = item.toString();
            
                            const _oder_detail = await queryRunner.manager.save(OderDetailEntity,new_oder_detail);
            
                            const _new_oder_detail_log = new OderDetailLogEntity();
                            _new_oder_detail_log.item_info = item.toString();
                            _new_oder_detail_log.quantity =  _new_oder_detail.quantity;
                            _new_oder_detail_log.oder_price =  _new_oder_detail.oder_price;
                            _new_oder_detail_log.origin_price = _new_oder_detail.origin_price;
                            _new_oder_detail_log.oderDetailEntity = _oder_detail;
            
                            await queryRunner.manager.save(OderDetailLogEntity,new_oder_detail);
                        }
                    }
                }else{
                    oder_price = origin_price;
                }

                const new_oder_detail = new OderDetailEntity();
                new_oder_detail.item_id = oder.oder_item[i].item_id;
                new_oder_detail.oderEntity = oder;
                new_oder_detail.quantity = oder.oder_item[i].quantity;
                new_oder_detail.oder_price = oder_price;
                new_oder_detail.origin_price = origin_price;
                new_oder_detail.item_info = item.toString();

                const oder_detail = await queryRunner.manager.save(OderDetailEntity,new_oder_detail);

                const new_oder_detail_log = new OderDetailLogEntity();
                new_oder_detail_log.item_info = item.toString();
                new_oder_detail_log.quantity =  new_oder_detail.quantity;
                new_oder_detail_log.oder_price =  new_oder_detail.oder_price;
                new_oder_detail_log.origin_price = new_oder_detail.origin_price;
                new_oder_detail_log.oderDetailEntity = oder_detail;

                await queryRunner.manager.save(OderDetailLogEntity,new_oder_detail);

            }

        }catch(err){
            console.log(err);
            throw new HttpException('failed', 500);
        }
    }
    
    async update(data: UpdateOderDetailDTO) {
        try{
            const oder_detail = await this.oderDetailRepository.findOne({where : {oder_detail_id : data.oder_detail_id}});
            if (!oder_detail)
                throw new HttpException('Not Found', 404);

            const result = await this.oderDetailRepository.update(data.oder_detail_id,data)
            return result;

        }catch(err){
            console.log(err);
            throw new HttpException('failed', 500);
        }
   }

    // delete oder-detail
    async delete(oder_detail_id : string): Promise<any> {
        try {
            // check oder detail exists
            const oder_detail = await this.oderDetailRepository.findOne({where : {oder_detail_id : oder_detail_id}});
            if (!oder_detail)
                throw new HttpException('Not Found', 404);

            // delete oder detail
            await this.oderDetailRepository.delete(oder_detail_id);
            return oder_detail;

        }catch (err){
            console.log(err);
            throw new HttpException('failed', 500);
        }
    }
}