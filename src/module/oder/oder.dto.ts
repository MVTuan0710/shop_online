import {IsNotEmpty} from "class-validator";

export class CreateOderDTO{
    @IsNotEmpty()
    user_id : string;

    voucher_code: string;
    oder_item: string;
    original_total_money: number;
    total_money: number;
    discount : number;

}
export class CreateOderItemDTO{

}