import {IsNotEmpty} from "class-validator";
import { ItemEntity } from "../item/item.entity";

export class CreateOderDTO{
    user_id : string;
    voucher_code: string;
    oder_item: CreateOderItemDTO[];
    original_total_money: number;
    total_money: number;
    discount : number;
}

export interface CreateOderItemDTO{
    item_id: string;
    quantity: number;
    item_info: string;
    oder_price: number;
    origin_price: number;
}