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

        private readonly saleItemService: SaleItemService
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
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try{
            const user = await this.userService.getById(data.user_id);
            
            const new_oder = new OderEntity();
            new_oder.userEntity = user;
            new_oder.original_total_money = 0;
            new_oder.total_money = 0;
            new_oder.voucher_code = data.voucher_code;
            new_oder.oderDetailEntity =data.oderDetailEntity;

            // cau 8
            if(user.roleEntity.role_id == 5){
                if(!data.shipping_info){
                    throw new HttpException(`Shipping info is empty`, HttpStatus.BAD_REQUEST);
                }
                new_oder.shipping_info = JSON.stringify(data.shipping_info);

            }else{
                if(!data.shipping_info){
                    new_oder.shipping_info = user.address;
                }
                if(data.shipping_info){
                    new_oder.shipping_info = JSON.stringify(data.shipping_info);
                }
            }
            
            new_oder.ware_house_info  = await this.wareHouserService.updateByCreateOder(data.oderDetailEntity, queryRunner);
            
            if(user.roleEntity.role_id == 1|| user.roleEntity.role_id == 2|| user.roleEntity.role_id == 3){
                new_oder.oderDetailEntity = await this.oderDetailService.createForStaff(new_oder);
                
            }else{
                new_oder.oderDetailEntity = await this.oderDetailService.createForCustomer(new_oder);
        
                if(new_oder.voucher_code){
                    await this.saleItemService.updateSaleItemByCreateOder(data.voucher_code, data.oderDetailEntity, queryRunner);
                }
            }
        
            for(let i = 0; i < new_oder.oderDetailEntity.length; i++){
                new_oder.original_total_money +=  new_oder.oderDetailEntity[i].origin_price;
                new_oder.total_money +=  new_oder.oderDetailEntity[i].oder_price; 
            }

            new_oder.discount = new_oder.original_total_money - new_oder.total_money;
            const result = await queryRunner.manager.save(OderEntity,new_oder); 
         
            await this.oderDetailService.create(result,queryRunner);  
        
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

    // cancel
    async cancel(oder_id: string): Promise<any> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try{
            // productRefund
            const oder = await this.oderRepository.findOne({
                where: {oder_id: oder_id},
                relations: {oderDetailEntity: true}
            });
            if(oder.status == 'cancel'){
                throw new HttpException('Oder is canceled',HttpStatus.BAD_REQUEST);
            }
            if(oder.status == 'create'){
                await this.wareHouserService.updateByCancelOder(oder, queryRunner);

                await this.saleItemService.updateSaleItemByCancelOder(oder, queryRunner);

                oder.status = 'cancel';
                const result =await queryRunner.manager.save(OderEntity,oder); 

                await queryRunner.commitTransaction();
                return result;
            }

        }catch(err){
            await queryRunner.rollbackTransaction();
            console.log(err)
            throw new HttpException(err,HttpStatus.BAD_REQUEST);
        
        } finally {
            await queryRunner.release();
        }
        
    }
}