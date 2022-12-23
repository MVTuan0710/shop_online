import { ItemEntity } from "../item/item.entity";


export class CreateItemLogDTO{
    name:string

    price:number

    height:number

    weight:number

    usage: string

    itemEntity: ItemEntity
}

