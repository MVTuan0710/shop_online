import {IsEmpty, IsNotEmpty} from "class-validator";
import { ItemEntity } from "../item/item.entity";
import { UserEntity } from "../users/user.entity";



export class CreateWareHouseDTO{
    @IsNotEmpty()
    user_id : string;

    @IsNotEmpty()
    quantity : number;

    @IsNotEmpty()
    expiry : Date;

    @IsNotEmpty()
    item_id : string;
}
export class UpdateWareHouseDTO{
    
    @IsEmpty()
    item_id : string;

    @IsEmpty()
    user_id : string;

    @IsEmpty()
    ware_house_id : string;

    @IsEmpty()
    quantity : number;

    @IsEmpty()
    expiry : Date;
}