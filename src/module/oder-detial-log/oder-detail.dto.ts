import {OderDetailEntity} from "../oder-detail/oder-detail.entity";


export class CreateOderDetailLogDTO{
    oderDetailEntity: OderDetailEntity;
    quantity : number;
    oder_price : number;
    origin_price : number;
    item_info: string;
}
