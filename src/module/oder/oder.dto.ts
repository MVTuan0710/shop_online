import { IsNotEmpty } from "class-validator";
import { OderDetailEntity } from "../oder-detail/oder-detail.entity";

export class CreateOderDTO{
    @IsNotEmpty()
    user_id : string;

    voucher_code: string;
   
    shipping_info: ShippingInfoDTO;

    original_total_money: number;

    ware_house_info: WareHouseInfoDTO;

    total_money: number;
    
    discount : number; 
    
    oderDetailEntity: OderDetailEntity[];
}
export interface WareHouseInfoDTO{

    item_id: string,
    ware_house_id: string,
    quantity: number
}
export interface ShippingInfoDTO{

    name: string,
    phone: string,
    address: string
}