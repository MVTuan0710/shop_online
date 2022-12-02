import {IsNotEmpty} from "class-validator";


export class CreateOderDetailDTO{
    oder_detail_id: string;
    item_id : string;
    oder_id : string;
    quantity : number;
}
