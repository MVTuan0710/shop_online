import {IsNotEmpty} from "class-validator";
import {OderDetailEntity} from "../oder-detail/oder-detail.entity";


export class CreateOderDetailLogDTO{
    oderDetailEntity: OderDetailEntity;

    total_money : number;

    quantity : number;
}
