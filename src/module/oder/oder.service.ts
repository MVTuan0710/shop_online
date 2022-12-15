import {HttpException, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {OderEntity} from "./oder.entity";
import {Repository} from "typeorm";
import {CreateOderDTO} from "./oder.dto";
import { UserService } from "../users/user.service";
import { OderDetailService } from "../oder-detail/oder-detail.service";
import { ItemService } from "../item/item.service";
import { WareHouseService } from "../ware-house/ware-house.service";
import { runInThisContext } from "vm";
import { SaleService } from "../sale/sale.service";
import { SaleItemService } from "../sale-item/sale-item.service";
import { OderDetailEntity } from "../oder-detail/oder-detail.entity";
import { Delete } from "@nestjs/common/decorators";
import { DataSource } from "typeorm";


@Injectable()
export class OderService {
    constructor(@InjectRepository(OderEntity) 
        private readonly oderRepository: Repository<OderEntity>,
        private readonly userService: UserService,
        private readonly oderDetailService: OderDetailService,
        private readonly itemService: ItemService, 
        private readonly dataSource: DataSource,
        private readonly wareHouserService: WareHouseService,
        private readonly saleService: SaleService,
        private readonly saleItemService: SaleItemService, 
    ) {}

    // find oder-detail by id
    async getByOderId(oder_id: string): Promise<OderEntity> {
        try{
            const data = await this.oderRepository.findOne({
                where: {oder_id: oder_id },
                relations: { userEntity : true }
            });
            
            return data;
        }catch(err){
            console.log(err)
            throw new HttpException('failed',500)
        }
        
    }

    // Find All oder-detail
    async find(): Promise<OderEntity[]> {
        try{
            const data = await this.oderRepository.find({
                //  relations: { oderDetailEntity : true }
            });
            return data;

        }catch(err){
            console.log(err)
            throw new HttpException('failed',500)
        }
        
    }



    
    // create oder
   async create (data: CreateOderDTO):Promise<any> {
    try{
        const user = await this.userService.getById(data.user_id);
        
        const new_oder = new OderEntity();
        new_oder.userEntity = user;
        new_oder.original_total_money = 0;
        new_oder.total_money = 0;
        new_oder.voucher_code = data.voucher_code;
        new_oder.oder_item = data.oder_item;
        
        await this.wareHouserService.updateByOder(data.oder_item);
        
        
            
            // const oder = await this.oderRepository.save(new_oder); 
        
    
        
        //check, update ware house by oder
        

    }catch(err){
        console.log(err)
        throw new HttpException('failed',500)
    }
        
   }
    
    // update oder-detail
    async update(oder_id : string, data: CreateOderDTO): Promise<any> {
       try {
           // user
           const user  = await this.userService.getById(data.user_id)

           if (!user){
                throw new HttpException('Not Found', 404);
           }

           const oderEntity = new OderEntity();
            oderEntity.userEntity = user;

            // update account
            const result = await this.oderRepository.update(oder_id,oderEntity);
            return result;
       }catch (err){
            console.log(err)
            throw new HttpException('failed',500)
       }
    }

    // delete oder-detail
    async delete(oder_id : string): Promise<any> {
        try {
            // check item exists
            const data = await this.oderRepository.findOne({where : {oder_id : oder_id}});
            if (!data)
                throw console.log('Can`t found Warehouse by id');

            // delete
            const result = await this.oderRepository.delete(oder_id);
            return result;
        }catch (err){
            console.log(err)
            throw new HttpException('failed',500)
        }
    }
}