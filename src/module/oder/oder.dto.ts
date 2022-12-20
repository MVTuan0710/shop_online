import { CreateOderDetailDTO } from "../oder-detail/oder-detail.dto";
import { OderDetailEntity } from "../oder-detail/oder-detail.entity";
import { UserEntity } from "../users/user.entity";

export class CreateOderDTO{
    user_id : string;
    userEntity: UserEntity;
    voucher_code: string;
    oderDetailEntity: OderDetailEntity[];
    original_total_money: number;
    total_money: number;
    discount : number;
}

// export interface CreateOderItemDTO{
//     item_id: string;
//     quantity: number;
//     item_info: string;
//     oder_price: number;
//     origin_price: number;
// }