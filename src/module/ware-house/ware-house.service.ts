import {HttpException, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {WareHouseEntity} from "./ware-house.entity";
import {Repository} from "typeorm";
import {CreateWareHouseDTO, UpdateWareHouseDTO} from "./ware-house.dto";
import { UserService } from "../users/user.service";
import { ItemService } from "../item/item.service";
import {WareHouseLogEntity} from "../ware-house-log/ware-house-log.entity";
import {WareHouseLogService} from "../ware-house-log/ware-house-log.servic";
import { GetItemDTO } from "../item/item.dto";


@Injectable()
export class WareHouseService {
    public wareHouseEntity = new WareHouseEntity();
    constructor(@InjectRepository(WareHouseEntity) 
        private readonly wareHouseRepository: Repository<WareHouseEntity>,
                private readonly userService: UserService,
                private readonly itemService: ItemService,
                private readonly wareHouseLogService: WareHouseLogService

    ) {}

    // find warehouse by id
    async getById(ware_house_id: string): Promise<WareHouseEntity> {
        try{
            const result = await this.wareHouseRepository.findOne({
                where: {ware_house_id: ware_house_id },
                relations: { itemEntity: true, userEntity: true },
            });
            return result;
        }catch(err){
            throw new HttpException('failed',500)
        }

    }

    // async  getByItemId(item_id: string): Promise<WareHouseEntity>{
    //     try{
    //         const result = await this.wareHouseRepository.findOne({
    //             where: {itemEntity: ware_house_id },
    //             relations: { itemEntity: true, userEntity: true },
    //         });
    //     }catch (err){
    //         throw new HttpException('failed',500)
    //     }
    // }

    // Find All warehouse
    async find(): Promise<WareHouseEntity[]> {
        try{
            const accounts = await this.wareHouseRepository.find({
                relations: { itemEntity: true, userEntity: true }
                
            });
            return accounts;

        }catch(err){
            throw new HttpException('failed',500)
        }
        
    }
    
    // create warehouse
    async create(data: CreateWareHouseDTO, token: any): Promise<WareHouseEntity> {
        try {
            // check id exists
            console.log(data)
            const user  = await this.userService.getById(data.user_id);
            if (!user){
                throw console.log('The account is not found');
            }

            const _user = await this.userService.getById(data.user_id);
            
            const DataGetItem = new GetItemDTO();
                DataGetItem.item_id = data.item_id;
                DataGetItem.user_id =  data.user_id 
            const _item = await this.itemService.getById(DataGetItem);

            const wareHouseEntity = new WareHouseEntity();
            wareHouseEntity.expiry = data.expiry;
            wareHouseEntity.quantity = data.quantity;
            wareHouseEntity.userEntity = _user;
            wareHouseEntity.itemEntity = _item;

            // // save warehouse
            const _result = await this.wareHouseRepository.save(wareHouseEntity);

            const new_wareHouseLogEntity = new WareHouseLogEntity();
            new_wareHouseLogEntity.expiry = wareHouseEntity.expiry;
            new_wareHouseLogEntity.quantity= wareHouseEntity.quantity;
            new_wareHouseLogEntity.wareHouseEntity = _result

            await this.wareHouseLogService.create(new_wareHouseLogEntity)

            return _result;
        }catch(err){
            console.log("errors",err);
             throw console.log('Can`t create ware house');
        }
    }
    
    // update ware house
    async update( data: UpdateWareHouseDTO,token?: any): Promise<any> {
       try {
           // check account exists
           const warehouse = await this.wareHouseRepository.findOne({where : {ware_house_id : data.ware_house_id}});
           if (!warehouse)
               throw console.log('Can`t found Account by account_id');

            const _user = await this.userService.getById(data.user_id);

            const DataGetItem = new GetItemDTO();
                DataGetItem.item_id = data.item_id;
                DataGetItem.user_id =  data.user_id 
            const _item = await this.itemService.getById(DataGetItem);
            
            if(data.quantity < 0){
                var new_quantity = -data.quantity;
            }else{
                if(data.quantity == 0){
                    var new_quantity = 0;
                }else{
                    var new_quantity = data.quantity;
                }
            }
            
            const wareHouseEntity = new WareHouseEntity();
            wareHouseEntity.expiry = data.expiry;
            wareHouseEntity.quantity = new_quantity;
            wareHouseEntity.userEntity = _user;
            wareHouseEntity.itemEntity = _item;

           await this.wareHouseRepository.update(data.ware_house_id, wareHouseEntity);
           const result = await this.wareHouseRepository.findOne({where: {ware_house_id: data.ware_house_id}})

           const new_wareHouseLogEntity = new WareHouseLogEntity();
           new_wareHouseLogEntity.expiry = wareHouseEntity.expiry;
           new_wareHouseLogEntity.quantity= wareHouseEntity.quantity;
           new_wareHouseLogEntity.wareHouseEntity = result

           await this.wareHouseLogService.create(new_wareHouseLogEntity)

           return result;
       }catch (err){
           console.log('error',err);
           throw console.log('Can`t update ware-house');
       }
    }

    // delete ware house
    async delete(ware_house_id : string): Promise<any> {
        try {
            // check warehouse exists
            const data = await this.wareHouseRepository.findOne({where : {ware_house_id : ware_house_id}});
            if (!data)
                throw console.log('Can`t found Warehouse by id');

            // delete
            const result = await this.wareHouseRepository.delete(ware_house_id);
            return data;
        }catch (err){
            console.log('errors',err);
            throw console.log('Can`t delete Warehouse');
        }
    }
}