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
import moment from "moment";

@Injectable()
export class OderDetailService {
    public oderDetailEntity = new OderDetailEntity();
    constructor(@InjectRepository(OderDetailEntity) 
        private readonly oderDetailRepository: Repository<OderDetailEntity>,
                private readonly itemService: ItemService, 
                private readonly oderService: OderService, 
                private readonly wareHouseService: WareHouseService,
                private readonly jwtService : JwtService
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
    async create(data: CreateOderDetailDTO, token: any): Promise<OderDetailEntity> {
        try {
            // check item exists
            const item  = await this.itemService.getById(data.item_id,token);
            if(!item){
                throw console.error(`Can't found Item`);
            }
            // const a = String(item.wareHouseEntity.expiry);
            // moment(a).format('DD/MM/YYYY')
            // console.log(a);
            
            
            //get ware house
            const warehouse = await this.wareHouseService.getById(item.wareHouseEntity.ware_house_id)
            //quantity
            if(item.wareHouseEntity.quantity === 0){
                throw new HttpException('Out of stock', 500);

            }else{
                if(data.quantity > item.wareHouseEntity.quantity){
                    throw new HttpException(`Stock only ${item.wareHouseEntity.quantity}`, 500);

                }else{
                    const wareHouseQuantity = item.wareHouseEntity.quantity
                    const result = wareHouseQuantity - data.quantity;

                    //update ware-house
                    const _data = new UpdateWareHouseDTO();
                    _data.user_id = warehouse.userEntity.user_id;
                    _data.expiry = item.wareHouseEntity.expiry
                    _data.item_id = data.item_id;
                    _data.quantity =result;
                    _data.ware_house_id= item.wareHouseEntity.ware_house_id;
                    
                    await this.wareHouseService.update(_data)

                }
            }
            
            const _token = token.authorization.split(" ");
            const payload = this.jwtService.verify(_token[1]); 
            console.log(payload);
            
            if(payload.role.role_id === 1 || payload.role.role_id === 2 || payload.role.role_id === 3){

                var _total_money = item.price * data.quantity - (((item.price * data.quantity)/100)*20)
                
            }else{
                
                var _total_money = item.price * data.quantity ;
            }

            const oder = await this.oderService.getByOderId(data.oder_id);
            //check oder
            

            if (!item){
                throw console.log(`The item don't exist`);
            }

            const oderDetailEntity = new OderDetailEntity();
            oderDetailEntity.quantity = data.quantity;
            oderDetailEntity.itemEntity = item;
            oderDetailEntity.total_money = _total_money;
            oderDetailEntity.oderEntity = oder;

            // save oder detail
            const result = await this.oderDetailRepository.save(oderDetailEntity);
            return result;
        }catch(err){
            console.log("errors",err);
             throw console.log('Can`t create Oder detail');
        }
    }
    
    // // update oder-detail
    // async update(item_id : string, data: CreateItemDTO): Promise<any> {
    //    try {
    //        // check category exists
    //        const _category = await this.categoryService.getById(data.category_id);
    //        if (!_category)
    //            throw console.log('Can`t found Category by category_id');

  
    //            const category = await this.categoryService.getById(data.category_id);

    //            const itemEntity = new ItemEntity();
    //            itemEntity.name = data.name;
    //            itemEntity.price = data.price;
    //            itemEntity.height = data.height;
    //            itemEntity.weight = data.weight;
    //            itemEntity.usage = data.usage;
    //            itemEntity.categoryEntity =category;

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