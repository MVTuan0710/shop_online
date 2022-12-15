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
import { resourceLimits } from "worker_threads";
import { ItemEntity } from "../item/item.entity";


@Injectable()
export class WareHouseService {
    public wareHouseEntity = new WareHouseEntity();
    public itemEntity = new ItemEntity();
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
            console.log(err)
            throw new HttpException('Bad req',500)
        }

    }

    async getByItemId(item_id: string): Promise<WareHouseEntity[]>{
        try{
            const result = await this.wareHouseRepository.find(({
                where: {itemEntity: {item_id: item_id}},
                relations: { itemEntity: true},
            }))

            return result;
        }catch(err){
            console.log(err)
            throw new HttpException('Bad req',500)
        }
    }

    // async  getByItemId(item_id: string): Promise<WareHouseEntity>{
    //     try{
    //         const result = await this.wareHouseRepository.findOne({
    //             where: {itemEntity: ware_house_id },
    //             relations: { itemEntity: true, userEntity: true },
    //         });
    //     }catch (err){
    //           console.log(err)
            // throw new HttpException('Bad req',500)
    //     }
    // }

    // Find All warehouse
    async find(): Promise<WareHouseEntity[]> {
        try{
            const result = await this.wareHouseRepository.find({
                relations: { itemEntity: true, userEntity: true } 
            });
            return result;

        }catch(err){
            console.log(err)
            throw new HttpException('Bad req',500)
        }
        
    }
    
    // create warehouse
    async create(data: CreateWareHouseDTO): Promise<WareHouseEntity> {
        try {
            // check id exists
            console.log(data)
            const user  = await this.userService.getById(data.user_id);
            if (!user){
                throw console.log('The account is not found');
            }

            const _user = await this.userService.getById(data.user_id);
            const _item = await this.itemService.getByIdNormal(data.item_id);

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
            console.log(err)
            throw new HttpException('Bad req',500)
        }
    }
    
    // update ware house, update ca user tao ra ware house
    async update( data: UpdateWareHouseDTO): Promise<any> {
       try {
           // check account exists
           const warehouse = await this.wareHouseRepository.findOne({where : {ware_house_id : data.ware_house_id}});
           if (!warehouse)
               throw console.log('Can`t found Account by account_id');

            const _user = await this.userService.getById(data.user_id);
            const _item = await this.itemService.getByIdNormal(data.item_id);
            
            const wareHouseEntity = new WareHouseEntity();
            wareHouseEntity.expiry = data.expiry;
            wareHouseEntity.quantity = data.quantity;
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
        console.log(err)
        throw new HttpException('Bad req',500)
       }
    }

    // cap nhat nay se khong cap nhat lai user da tao record ware house
    // => kh co truong user_id
    async updateByOder(ware_house_id: string, quantity: number): Promise<any> {
        try{
            const warehouse = await this.wareHouseRepository.findOne({where : {ware_house_id : ware_house_id}});
            
            const wareHouseEntity = new WareHouseEntity();
            wareHouseEntity.expiry = warehouse.expiry;
            wareHouseEntity.quantity = quantity;
            wareHouseEntity.userEntity = warehouse.userEntity;
            wareHouseEntity.itemEntity = warehouse.itemEntity;

           await this.wareHouseRepository.update(ware_house_id,wareHouseEntity);
           const result = await this.wareHouseRepository.findOne({where: {ware_house_id: ware_house_id}})

           const new_wareHouseLogEntity = new WareHouseLogEntity();
           new_wareHouseLogEntity.expiry = wareHouseEntity.expiry;
           new_wareHouseLogEntity.quantity= wareHouseEntity.quantity;
           new_wareHouseLogEntity.wareHouseEntity = result

           await this.wareHouseLogService.create(new_wareHouseLogEntity)

        }catch(err){
            console.log(err)
            throw new HttpException('Bad req',500)
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
            console.log(err)
            throw new HttpException('Bad req',500)
        }
    }
}