import {IsNotEmpty} from "class-validator";


export class CreateOderDetailDTO{
    @IsNotEmpty()
    item_id : string;

    @IsNotEmpty()
    oder_id : string;

    @IsNotEmpty()
    quantity : number;

    user_id: string;
}
