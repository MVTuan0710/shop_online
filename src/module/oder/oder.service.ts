import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {OderEntity} from "./oder.entity";
import {Repository} from "typeorm";
import {CreateOderDTO} from "./oder.dto";
import { UserService } from "../users/user.service";
import { OderDetailService } from "../oder-detail/oder-detail.service";
import { WareHouseService } from "../ware-house/ware-house.service";
import { SaleItemService } from "../sale-item/sale-item.service";
import { DataSource } from "typeorm";


@Injectable()
export class OderService {
    constructor(@InjectRepository(OderEntity) 
        private readonly oderRepository: Repository<OderEntity>,

        private readonly userService: UserService,

        private readonly oderDetailService: OderDetailService,

        private readonly dataSource: DataSource,

        private readonly wareHouserService: WareHouseService,

        private readonly saleItemService: SaleItemService, 
    ) {}

    // find by id
    async getByOderId(oder_id: string): Promise<OderEntity> {
        try{
            const data = await this.oderRepository.findOne({
                where: {oder_id: oder_id },
                relations: { userEntity : true }
            });
            return data;
            
        }catch(err){
            console.log(err)
            throw new HttpException('Bad req',HttpStatus.BAD_REQUEST);
        }
    }

    // Find all
    async find(): Promise<OderEntity[]> {
        try{
            const data = await this.oderRepository.find({
                 relations: { oderDetailEntity : true }
            });
            return data;

        }catch(err){
            console.log(err)
            throw new HttpException('Bad req',HttpStatus.BAD_REQUEST);
        }
        
    }

    
    // create 
   async create (data: CreateOderDTO):Promise<any> {
        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction();
        
        try{
            const user = await this.userService.getById(data.user_id);
            
            const new_oder = new OderEntity();
            new_oder.userEntity = user;
            new_oder.original_total_money = 0;
            new_oder.total_money = 0;
            new_oder.voucher_code = data.voucher_code;
            
            // cau 8
            if(user.roleEntity.role_id == 5){
                new_oder.shipping_info = JSON.stringify(data.shipping_info);
            }else{
                if(!data.shipping_info){
                    new_oder.shipping_info = user.address;
                }
                if(data.shipping_info){
                    new_oder.shipping_info = JSON.stringify(data.shipping_info);
                }
            }
            
    
            new_oder.oderDetailEntity = data.oderDetailEntity;

            const _oder = await queryRunner.manager.save(OderEntity,new_oder); 
            
            await this.wareHouserService.updateByOder(data.oderDetailEntity, queryRunner);
            
            if(user.roleEntity.role_id == 1|| user.roleEntity.role_id == 2|| user.roleEntity.role_id == 3){
                await this.oderDetailService.createForStaff(_oder,queryRunner);
            
            }else{
                await this.oderDetailService.createForCustomer(_oder,queryRunner);

                if(new_oder.voucher_code){
                    await this.saleItemService.updateSaleItemByOder(data.voucher_code, data.oderDetailEntity, queryRunner);
                }
            }

            const oder_detail = await this.oderDetailService.getByOderId(_oder.oder_id,queryRunner);
        
            for(let i = 0; i < oder_detail.length; i++){
                _oder.original_total_money += oder_detail[i].origin_price;
                _oder.total_money += oder_detail[i].oder_price; 
            }

            _oder.oderDetailEntity = oder_detail;
            _oder.discount = _oder.original_total_money - _oder.total_money;
            const result = await queryRunner.manager.save(OderEntity,_oder); 
            
            await queryRunner.commitTransaction();
            return result;
        
        }catch(err){
            await queryRunner.rollbackTransaction();
            console.log(err)
            throw new HttpException('Bad req',HttpStatus.BAD_REQUEST);
        
        } finally {
            await queryRunner.release();
        }
        
   }

    // delete
    async delete(oder_id : string): Promise<any> {
        try {
            // check item exists
            const data = await this.oderRepository.findOne({where : {oder_id : oder_id}});
            if (!data){
                throw console.log('Not found',HttpStatus.NOT_FOUND);
            }
            
            // delete
            const result = await this.oderRepository.delete(oder_id);
            return result;

        }catch (err){
            console.log(err)
            throw new HttpException('Bad req',HttpStatus.BAD_REQUEST);
        }
    }
}