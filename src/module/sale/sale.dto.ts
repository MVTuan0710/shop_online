import {IsNotEmpty} from "class-validator";


export class CreateSaleDTO{
    @IsNotEmpty()
    name : string;

    @IsNotEmpty()
    voucher_code : string;

    @IsNotEmpty()
    value: number;

    @IsNotEmpty()
    start_date: Date;

    @IsNotEmpty()
    end_date: Date;

    user_id: string;
}
export class UpdateActiveSaleDTO{
    applied: boolean;
}
