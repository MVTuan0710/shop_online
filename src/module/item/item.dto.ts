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

    
    email : string;
}
