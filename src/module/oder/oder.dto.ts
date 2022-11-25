import {IsNotEmpty} from "class-validator";


export class CreateOderDTO{
    @IsNotEmpty()
    user_id : string;
}
