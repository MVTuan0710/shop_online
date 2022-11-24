import {IsNotEmpty} from "class-validator";


export class CreateOderDTO{
    @IsNotEmpty()
    user_id : string;

    @IsNotEmpty()
    oder_detail_id : string;
}
