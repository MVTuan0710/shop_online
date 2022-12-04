import {WareHouseEntity} from "../ware-house/ware-house.entity";


export class CreateWareHouseLogDTO{
    id:string
    quantity:number
    expiry:Date
    wareHouseEntity:WareHouseEntity
}

