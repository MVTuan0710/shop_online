import {WareHouseEntity} from "../ware-house/ware-house.entity";


export class CreateWareHouseLogDTO{
    id: string;
    quantity: number;
    expiry: Date;
    wareHouseEntity: WareHouseEntity;
    pre_ordered_quantity: number;
    sold_quantity: number;
}

