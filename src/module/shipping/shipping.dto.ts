import {IsNotEmpty} from "class-validator";

export class CreateShippingDTO{
    @IsNotEmpty()
    phone : string;

    @IsNotEmpty()
    name : string;
    
    @IsNotEmpty()
    oder_id : string;
    
    user_id: string;
}