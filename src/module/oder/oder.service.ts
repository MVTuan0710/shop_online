import {HttpException, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {OderEntity} from "./oder.entity";
import {Repository} from "typeorm";
import {CreateOderDTO} from "./oder.dto";
import { UserService } from "../users/user.service";
import { OderDetailService } from "../oder-detail/oder-detail.service";
import { ItemService } from "../item/item.service";
import { WareHouseService } from "../ware-house/ware-house.service";
import { runInThisContext } from "vm";
import { SaleService } from "../sale/sale.service";
import { SaleItemService } from "../sale-item/sale-item.service";
import { OderDetailEntity } from "../oder-detail/oder-detail.entity";
var moment = require('moment');


@Injectable()
export class OderService {
    constructor(@InjectRepository(OderEntity) 
        private readonly oderRepository: Repository<OderEntity>,
        private readonly userService: UserService,
        private readonly oderDetailService: OderDetailService,
        private readonly itemService: ItemService, 
        private readonly wareHouserService: WareHouseService,
        private readonly saleService: SaleService,
        private readonly saleItemService: SaleItemService
    ) {}

    // find oder-detail by id
    async getByOderId(oder_id: string): Promise<OderEntity> {
        try{
            const data = await this.oderRepository.findOne({
                where: {oder_id: oder_id },
                relations: { userEntity : true }
            });
            
            return data;
        }catch(err){
            console.log(err)
            throw new HttpException('failed',500)
        }
        
    }

    // Find All oder-detail
    async find(): Promise<OderEntity[]> {
        try{
            const data = await this.oderRepository.find({
                //  relations: { oderDetailEntity : true }
            });
            return data;

        }catch(err){
            console.log(err)
            throw new HttpException('failed',500)
        }
        
    }



    
    // create oder
   async create (data: CreateOderDTO):Promise<any> {
    try{
        const oder = await this.oderRepository.create(data)
    
        let original_total_money = 0;
        let total_money = 0;
        //check, update ware house by oder
        for(let j = 0; j < data.oder_item.length; j++){

            const item = await this.itemService.getByIdNormal(data.oder_item[j].item_id);
            if (!item){
                throw new HttpException('Not Found item', 404);
            }
            data.oder_item[j].item_info = JSON.stringify(item);
            // tinh tong so luong co san trong ware house
            let sum_quantity_of_item_in_ware_house= 0;
            // tinh hieu giua so luong item can mua va so luong item co trong ware house
            let tmp = 0;
            let ware_house =await this.wareHouserService.getByItemId(data.oder_item[j].item_id);
            for(let z = 0; z < ware_house.length; z++){
                // month = ngay hien tai + 30 ngay 
                // expiry ngay het hang su dung cua item trong ware house
                const month = moment().add(30, 'days').format('DD/MM/YYYY');
                const expiry = moment(ware_house[z].expiry).format('DD/MM/YYYY');
                
                if(month <= expiry){
                    console.log(`San pham co ma ware hosue ${ware_house[z].ware_house_id} , co ten ${ware_house[z].itemEntity.name} het hang`);
                
                }else{
                    sum_quantity_of_item_in_ware_house += ware_house[z].quantity;
                    
                    if(sum_quantity_of_item_in_ware_house > data.oder_item[j].quantity)
                        break;
                }
            }

            // cap nhat lai quantity cua item trong ware house
            if(sum_quantity_of_item_in_ware_house >= data.oder_item[j].quantity){
                for(let x = 0; x < ware_house.length; x++){
             
                    const month = moment().add(30, 'days').format('DD/MM/YYYY');
                    const expiry = moment(ware_house[x].expiry).format('DD/MM/YYYY');

                    // tinh toan, update lai ware houe 
                    if(month > expiry){
                        tmp = data.oder_item[j].quantity - ware_house[x].quantity

                        if(tmp > 0){
                            ware_house[x].quantity = 0
                            await this.wareHouserService.updateByOder(ware_house[x].ware_house_id,ware_house[x].quantity)
                        }else{
                            ware_house[x].quantity = -tmp;
                            await this.wareHouserService.updateByOder(ware_house[x].ware_house_id,ware_house[x].quantity)
                            break;
                        }
                    }
                }
            }else{
                throw new HttpException('Out of Stock', 500);
            }
            // Tinh tien 
            const user = await this.userService.getById(data.user_id);
                // tinh origin_price
                data.oder_item[j].origin_price = data.oder_item[j].quantity * item.price;
                // tinh origin_total_money
                data.original_total_money += data.oder_item[j].origin_price;
                if(user.roleEntity.role_id === 3 || user.roleEntity.role_id === 2 || user.roleEntity.role_id === 1 ){
                    var oder_price = data.oder_item[j].origin_price - (((data.oder_item[j].origin_price)/100)*20);
                    data.total_money +=oder_price;
                }else{
                    if(data.voucher_code){
                        const voucher = await this.saleService.getByCode(data.voucher_code);
                        for(let j = 0; j < voucher.saleItemEntity.length; j++){
                            if(data.oder_item[j].item_id == voucher.saleItemEntity[j].itemEntity.item_id){
                                var oder_price = data.oder_item[j].origin_price - voucher.value;
                                data.total_money +=oder_price;

                                await this.saleItemService.updateByOder(voucher.saleItemEntity[j].sale_item_id,data.oder_item[j].quantity)
                            }else{
                                var oder_price = data.oder_item[j].origin_price;
                                data.total_money +=oder_price;
                            }
                        }
                    }else{
                        let oder_price = data.oder_item[j].origin_price;
                        data.total_money += oder_price;

                    }
                }
            const new_oder_detail = new OderDetailEntity();
            new_oder_detail.item_info = data.oder_item[j].item_info;
            new_oder_detail.item_id = data.oder_item[j].item_id;
            new_oder_detail.quantity = data.oder_item[j].quantity,
            new_oder_detail.oderEntity = oder;
            new_oder_detail.oder_price = oder_price;
            new_oder_detail.origin_price =  data.oder_item[j].origin_price;
            
            const oder_detail = await this.oderDetailService.create(new_oder_detail);
        }
        

        
    }catch(err){
        console.log(err)
        throw new HttpException('failed',500)
    }
        
   }
    
    // update oder-detail
    async update(oder_id : string, data: CreateOderDTO): Promise<any> {
       try {
           // user
           const user  = await this.userService.getById(data.user_id)

           if (!user){
                throw new HttpException('Not Found', 404);
           }

           const oderEntity = new OderEntity();
            oderEntity.userEntity = user;

            // update account
            const result = await this.oderRepository.update(oder_id,oderEntity);
            return result;
       }catch (err){
            console.log(err)
            throw new HttpException('failed',500)
       }
    }

    // delete oder-detail
    async delete(oder_id : string): Promise<any> {
        try {
            // check item exists
            const data = await this.oderRepository.findOne({where : {oder_id : oder_id}});
            if (!data)
                throw console.log('Can`t found Warehouse by id');

            // delete
            const result = await this.oderRepository.delete(oder_id);
            return result;
        }catch (err){
            console.log(err)
            throw new HttpException('failed',500)
        }
    }
}