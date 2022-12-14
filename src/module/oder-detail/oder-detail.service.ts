import {HttpException, Inject, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {OderDetailEntity} from "./oder-detail.entity";
import { UserService } from "../users/user.service";
import {Repository} from "typeorm";
import {CreateOderDetailDTO} from "./oder-detail.dto";
import { ItemService} from "../item/item.service";
import { OderService } from "src/module/oder/oder.service";
import { WareHouseService } from "../ware-house/ware-house.service";
import {UpdateWareHouseDTO}  from "../ware-house/ware-house.dto";
import {OderDetailLogEntity} from "../oder-detial-log/oder-detail-log.entity";
import {OderDetailLogService} from "../oder-detial-log/oder-detail.service";
import { GetItemDTO } from "../item/item.dto";
import { SaleService } from "../sale/sale.service";

@Injectable()
export class OderDetailService {
    public oderDetailEntity = new OderDetailEntity();
    constructor(
        @InjectRepository(OderDetailEntity) 
        private readonly oderDetailRepository: Repository<OderDetailEntity>,
        private readonly wareHouseService: WareHouseService,
        private readonly saleService: SaleService,
        private readonly userService: UserService,
        // private readonly oderService: OderService, 
        private readonly itemService: ItemService,
        private readonly oderDetailLogService: OderDetailLogService
        
    ) {

    }

    //find oder-detail by id
    async getById(oder_detail_id: string): Promise<OderDetailEntity> {
        const data = await this.oderDetailRepository.findOne({
            where: {oder_detail_id: oder_detail_id },
            relations: { oderEntity : true }
        });
        
        return data;
    }

    // Find All oder-detail
    async find(): Promise<OderDetailEntity[]> {
        try{
            const data = await this.oderDetailRepository.find({
                 relations: { oderEntity : true }
            });
            return data;

        }catch(err){
            throw err;
        }
        
    }
    // //cau 9
    // // create oder-detail
    // async create(data: CreateOderDetailDTO): Promise<any> {
    //     try {
    //         // check item exists
    //         const DataGetItem = new GetItemDTO();
    //             DataGetItem.item_id = data.item_id;
    //             DataGetItem.user_id =  data.user_id 
    //         const item = await this.itemService.getByIdNormal(data.item_id);
    //         const ware_house = await this.wareHouseService.getByItemId(data.item_id)
    //         const user = await this.userService.getById(data.user_id)
            
    //         if(!item){
    //             throw new HttpException('failed',500)
    //         }

    //         let quantity = data.quantity 
    //         //update quantity of item in warehouse
    //         for (let i = 0; i < ware_house.length; i++) {
    //             // TH: so luong san pham co trong ware house == 0
    //             if(ware_house[i].quantity === 0){
    //                console.log(`Out of Stock ${item.name}`);
    //                // TH: so luong san pham co trong ware house khac 0
    //             }else{
    //                 // TH: so luong san pham can mua lon hon so luong san pham co trong ware house
    //                 if(quantity > ware_house[i].quantity){
    //                     const hieu = quantity - ware_house[i].quantity;
                            

    //                     const _data = new UpdateWareHouseDTO();
    //                     _data.expiry = ware_house[i].expiry;
    //                     _data.item_id = data.item_id;
    //                     _data.quantity = 0;
    //                     _data.ware_house_id= ware_house[i].ware_house_id;
        
    //                     await this.wareHouseService.updateByOderDetail(_data);
    //                     // cap nhat lai so luong can mua khi sau khi tru 1 record ware house
    //                     // => cap nhat so luong cua san pham o ware house = 0 
    //                     // => cap nhat lai so luong can mua                                                                           
    //                     quantity  =  hieu;
    //             }else{
    //             //TH: so luong san pham can mua == so luong san pham co trong ware house
    //         if(ware_house[i].quantity=== quantity){
    
    //                     //update oder-detail
    //                     const _data = new UpdateWareHouseDTO();
    //                     _data.expiry = ware_house[i].expiry
    //                     _data.item_id = data.item_id;
    //                     // se cap nhat lai so luong san pham co trong ware house == 0
    //                     _data.quantity =0;
    //                     _data.ware_house_id= ware_house[i].ware_house_id;

    //                     await this.wareHouseService.updateByOderDetail(_data)
    //         }else{
    //             //TH: so luong san pham co trong ware house lon hon so luong san pham can mua
    //             const wareHouseQuantity = ware_house[i].quantity
    //                     const result = wareHouseQuantity - data.quantity;
    
    //                     //update oder-detail
    //                     const _data = new UpdateWareHouseDTO();
    //                     _data.user_id = data.user_id;
    //                     _data.expiry = ware_house[i].expiry
    //                     _data.item_id = data.item_id;
    //                     // so luong con lai cua san pham con lai = hieu cua sl san pham trong wh - sl san pham can mua
    //                     _data.quantity = -result;
    //                     _data.ware_house_id= ware_house[i].ware_house_id;
    
    //                     await this.wareHouseService.updateByOderDetail(_data)
    //         }
                        
    
    //                 }
    //             }
    //         }

    //         //check oder
    //         const oder = await this.oderService.getByOderId(data.oder_id);
    //         if (!oder){
    //             throw new HttpException('failed',500)
    //         }

    //         const origin_price = item.price * data.quantity;
    //         if(user.roleEntity.role_id === 1 || user.roleEntity.role_id === 2 || user.roleEntity.role_id === 3){
    //             var new_oder_price = origin_price - (((item.price * data.quantity)/100)*20);
    //             }else{
    //             if(oder.voucher_code){
    //                 // const sale = await this.saleService.getByCode(oder.)
    //                 // if()
    //                 const sale = await this.saleService.getByCode(oder.voucher_code)
    //                 for (let i = 0 ; i< sale.saleItemEntity.length; i++){
    //                     if(sale.saleItemEntity[i].itemEntity.item_id == item.item_id ){
    //                         var new_oder_price = origin_price - sale.value;
    //                     } 
    //                 }
    //             }else{
    //                 var new_oder_price = item.price * data.quantity;
    //             }
    //         }
    
    //         // ep kieu item ve String
    //         const new_item = JSON.stringify(item);

    //         const oderDetailEntity = new OderDetailEntity();
    //         oderDetailEntity.item_info = new_item;
    //         oderDetailEntity.quantity = data.quantity;
    //         oderDetailEntity.item_id = data.item_id;
    //         oderDetailEntity.oder_price = new_oder_price;
    //         oderDetailEntity.origin_price = origin_price;
    //         oderDetailEntity.oderEntity = oder;

    //         // save oder detail
    //         const result = await this.oderDetailRepository.save(oderDetailEntity)
    
    //         const oderDetailLogEntity = new OderDetailLogEntity();
    //         oderDetailLogEntity.quantity = result.quantity;
    //         oderDetailLogEntity.oder_price = result.oder_price;
    //         oderDetailLogEntity.origin_price = result.origin_price;
    //         oderDetailLogEntity.item_info = result.item_info;
    //         oderDetailLogEntity.oderDetailEntity = result;
    
    //         await this.oderDetailLogService.create(oderDetailLogEntity)
   
    
    //         return result;
    //     }catch(err){
    //         console.log(err)
    //         throw new HttpException('failed',500)
    //     }
    // }
    
    // update oder-detail
    // async update(item_id : string, data: CreateItemDTO): Promise<any> {
    //    try {
    //        // check category exists
    //        const _category = await this.categoryService.getById(data.category_id);
    //        if (!_category)
    //            throw console.log('Can`t found Category by category_id');
    //
    //
    //            const category = await this.categoryService.getById(data.category_id);
    //
    //            const itemEntity = new ItemEntity();
    //            itemEntity.name = data.name;
    //            itemEntity.price = data.price;
    //            itemEntity.height = data.height;
    //            itemEntity.weight = data.weight;
    //            itemEntity.usage = data.usage;
    //            itemEntity.categoryEntity =category;
    //
    //         // update account
    //        const result = await this.itemRepository.update(item_id, itemEntity);
    //        return result;
    //    }catch (err){
    //        console.log('error',err);
    //        throw console.log('Can`t update item');
    //    }
    // }

    // delete oder-detail
    async delete(oder_detail_id : string): Promise<any> {
        try {
            // check item exists
            const data = await this.oderDetailRepository.findOne({where : {oder_detail_id : oder_detail_id}});
            if (!data)
                throw console.log('Can`t found Warehouse by id');

            // delete
            await this.oderDetailRepository.delete(oder_detail_id);
            return data;
        }catch (err){
            console.log('errors',err);
            throw console.log('Can`t delete Warehouse');
        }
    }
}