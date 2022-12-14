import {IsNotEmpty} from "class-validator";
import { ItemEntity } from "../item/item.entity";
import { SaleEntity } from "../sale/sale.entity";


export class CreateSaleItemDTO{
    @IsNotEmpty()
    amount : number;

    @IsNotEmpty()
    sale_id: string;

    @IsNotEmpty()
    item_id: string;

    user_id: string;    
}
