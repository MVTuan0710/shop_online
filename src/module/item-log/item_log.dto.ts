import { ItemEntity } from "../item/item.entity";
import {IsNotEmpty} from "class-validator";


export class CreateItemLogDTO{
    @IsNotEmpty()
    name:string

    @IsNotEmpty()
    price:number

    @IsNotEmpty()
    height:number

    @IsNotEmpty()
    weight:number

    @IsNotEmpty()
    usage: string

    itemEntity: ItemEntity
}

