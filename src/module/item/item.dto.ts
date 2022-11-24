import {IsEmpty, IsNotEmpty} from "class-validator";
import { BodyLogin } from "../auth/auth.dto";


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
}
