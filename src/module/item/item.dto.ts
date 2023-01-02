import {IsNotEmpty} from "class-validator";


export class CreateItemDTO {
    @IsNotEmpty()
    name : string;

    @IsNotEmpty()
    price : number;

    @IsNotEmpty()
    height : number;

    @IsNotEmpty()
    weight : number;

    @IsNotEmpty()
    usage : string;

    @IsNotEmpty()
    category_id : string;

    user_id : string;
}
export class GetItemDTO{
    @IsNotEmpty()
    role_id: number;

    @IsNotEmpty()
    item_id : string;
    
    name: string;
}