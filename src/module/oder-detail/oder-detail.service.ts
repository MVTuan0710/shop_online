import {HttpException, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {OderDetailEntity} from "./oder-detail.entity";
import {Repository} from "typeorm";
import {CreateOderDetailDTO} from "./oder-detail.dto";
import { ItemService} from "../item/item.service";
import { OderService } from "../oder/oder.service";
import { WareHouseService } from "../ware-house/ware-house.service";
import {UpdateWareHouseDTO}  from "../ware-house/ware-house.dto";
import { JwtService } from "@nestjs/jwt";
import {OderDetailLogEntity} from "../oder-detial-log/oder-detail-log.entity";
import {OderDetailLogService} from "../oder-detial-log/oder-detail.service";
import { GetItemDTO } from "../item/item.dto";
import { UserService } from "../users/user.service";


@Injectable()
export class OderDetailService {
    public oderDetailEntity = new OderDetailEntity();
    constructor(@InjectRepository(OderDetailEntity) 
        private readonly oderDetailRepository: Repository<OderDetailEntity>,
                private readonly itemService: ItemService, 
                private readonly oderService: OderService, 
                private readonly wareHouseService: WareHouseService,
                private readonly userService: UserService,
                private readonly oderDetailLogService: OderDetailLogService
    ) {}

    // find oder-detail by id
    async getById(oder_detail_id: string): Promise<OderDetailEntity> {
        const data = await this.oderDetailRepository.findOne({
            where: {oder_detail_id: oder_detail_id },
            relations: { itemEntity : true }
        });
        
        return data;
    }

    // Find All oder-detail
    async find(): Promise<OderDetailEntity[]> {
        try{
            const data = await this.oderDetailRepository.find({
                 relations: { itemEntity : true }
            });
            return data;

        }catch(err){
            throw err;
        }
        
    }
    //cau 9
    // create oder-detail
    async create(data: CreateOderDetailDTO): Promise<any> {
        try {
            // check item exists
            const DataGetItem = new GetItemDTO();
                DataGetItem.item_id = data.item_id;
                DataGetItem.user_id =  data.user_id 
            const item = await this.itemService.getById(DataGetItem);

            const user = await this.userService.getById(data.user_id)
            
            if(!item){
                throw new HttpException('failed',500)
            }

            let quantity = data.quantity 
            //quantity
            for (let i = 0; i < item.wareHouseEntity.length; i++) {
                if(item.wareHouseEntity[i].quantity === 0){
                   console.log(`Out of Stock ${item.wareHouseEntity[i]}`);
                }else{
                    if(quantity > item.wareHouseEntity[i].quantity){
                        const hieu = quantity - item.wareHouseEntity[i].quantity;
                            

                        const _data = new UpdateWareHouseDTO();
                        _data.user_id = data.user_id;
                        _data.expiry = item.wareHouseEntity[i].expiry;
                        _data.item_id = data.item_id;
                        _data.quantity = 0;
                        _data.ware_house_id= item.wareHouseEntity[i].ware_house_id;
        
                        await this.wareHouseService.update(_data);                                                                            
                        quantity  =  hieu;
                }else{
            if(item.wareHouseEntity[i].quantity === quantity){
    
                        //update oder-detail
                        const _data = new UpdateWareHouseDTO();
                        _data.user_id = data.user_id;
                        _data.expiry = item.wareHouseEntity[i].expiry
                        _data.item_id = data.item_id;
                        _data.quantity =0;
                        _data.ware_house_id= item.wareHouseEntity[i].ware_house_id;
    
                        await this.wareHouseService.update(_data)
            }else{
                const wareHouseQuantity = item.wareHouseEntity[i].quantity
                        const result = wareHouseQuantity - data.quantity;
    
                        //update oder-detail
                        const _data = new UpdateWareHouseDTO();
                        _data.user_id = data.user_id;
                        _data.expiry = item.wareHouseEntity[i].expiry
                        _data.item_id = data.item_id;
                        _data.quantity = -result;
                        _data.ware_house_id= item.wareHouseEntity[i].ware_house_id;
    
                        await this.wareHouseService.update(_data)
            }
                        
    
                    }
                }
            }
    
            
            if(user.roleEntity.role_id === 1 || user.roleEntity.role_id === 2 || user.roleEntity.role_id === 3){
    
                var _total_money = item.price * data.quantity - (((item.price * data.quantity)/100)*20)
                
            }else{
                
                var _total_money = item.price * data.quantity ;
            }
    
            const oder = await this.oderService.getByOderId(data.oder_id);
            //check oder
    
            if (!oder){
                throw new HttpException('failed',500)
            }
    
            const oderDetailEntity = new OderDetailEntity();
            oderDetailEntity.quantity = data.quantity;
            oderDetailEntity.itemEntity = item;
            oderDetailEntity.total_money = _total_money;
            oderDetailEntity.oderEntity = oder;

            // save oder detail
            const result = await this.oderDetailRepository.save(oderDetailEntity)
    
            const new_oderDetailLogEntity = new OderDetailLogEntity();
            new_oderDetailLogEntity.quantity = result.quantity;
            new_oderDetailLogEntity.total_money = result.total_money;
            new_oderDetailLogEntity.oderDetailEntity = result;
    
            await this.oderDetailLogService.create(new_oderDetailLogEntity)
   
    
            return result;
        }catch(err){
            console.log(err)
            throw new HttpException('failed',500)
        }
    }
    
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