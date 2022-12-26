import {IsNotEmpty} from "class-validator";


export class CreateSaleItemDTO{
    @IsNotEmpty()
    amount : number;

    @IsNotEmpty()
    sale_id: string;

    @IsNotEmpty()
    item_id: string;

    user_id: string;    
}
