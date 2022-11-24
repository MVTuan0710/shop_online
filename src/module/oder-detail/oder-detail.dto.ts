import {IsNotEmpty} from "class-validator";


export class CreateOderDetailDTO{
    @IsNotEmpty()
    item_id : string;

    @IsNotEmpty()
    quantity : number;
}
