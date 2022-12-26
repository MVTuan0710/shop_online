import {IsNotEmpty} from "class-validator";


export class CreateWareHouseDTO{
    @IsNotEmpty()
    create_at : string;

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
    create_at: string;
    expiry: Date;
    item_id: string;
}