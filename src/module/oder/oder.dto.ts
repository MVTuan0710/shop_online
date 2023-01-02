import { IsNotEmpty } from "class-validator";
import { OderDetailEntity } from "../oder-detail/oder-detail.entity";

export class CreateOderDTO{
    @IsNotEmpty()
    user_id : string;

    voucher_code: string;
   
    shipping_info: ShippingInfo;

    original_total_money: number;

    total_money: number;
    
    discount : number; 
    
    oderDetailEntity: OderDetailEntity[];
}

export interface ShippingInfo{

    name: string,
    phone: string,
    address: string
}