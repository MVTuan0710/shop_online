import {IsNotEmpty} from "class-validator";
import { SaleEntity } from "../sale/sale.entity";


export class CreateSaleLogDTO{
    saleEntity : SaleEntity;
    name : string;
    voucher_code : string;
    start_date: Date;
    end_date: Date;
    value: number;
}