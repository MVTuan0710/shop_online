import {IsNotEmpty} from "class-validator";
import { OderEntity } from "../oder/oder.entity";


export class CreateOderDetailDTO{
    @IsNotEmpty()
    item_id : string;

    @IsNotEmpty()
    oderEntity : OderEntity;

    @IsNotEmpty()
    quantity : number;

    oder_price: number;
    origin_price: number;
    item_info: string;
    ware_house: string;
}
export interface UpdateOderDetailDTO{
    oder_detail_id: string;
    item_id : string;
    oder_id : string;
    quantity : number;
    oder_price: number;
    origin_price: number;
    item_info: string;
    ware_house: string;
}
