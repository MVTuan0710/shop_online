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
    ware_house_id : string;
    quantity : number;
    user_id: string;
    expiry: Date;
    item_id: string;
}