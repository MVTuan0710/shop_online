import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {WareHouseEntity} from "./ware-house.entity";
import {Repository} from "typeorm";
import {CreateWareHouseDTO, UpdateWareHouseDTO} from "./ware-house.dto";
import { UserService } from "../users/user.service";
import { ItemService } from "../item/item.service";
import { ItemEntity } from "../item/item.entity";


@Injectable()
export class WareHouseService {
    public wareHouseEntity = new WareHouseEntity();
    constructor(@InjectRepository(WareHouseEntity) 
        private readonly wareHouseRepository: Repository<WareHouseEntity>,
                private readonly userService: UserService,
                private readonly itemService: ItemService

    ) {}

    // find warehouse by id
    async getById(ware_house_id: string): Promise<WareHouseEntity> {
        const accounts = await this.wareHouseRepository.findOne({
            where: {ware_house_id: ware_house_id },
            relations: { itemEntity: true, userEntity: true },
        });
        return accounts;
    }

    // Find All warehouse
    async find(): Promise<WareHouseEntity[]> {
        try{
            const accounts = await this.wareHouseRepository.find({
                relations: { itemEntity: true, userEntity: true }
                
            });
            return accounts;

        }catch(err){
            throw err;
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
            const _item = await this.itemService.getById(data.item_id)

            const wareHouseEntity = new WareHouseEntity();
            wareHouseEntity.expiry = data.expiry;
            wareHouseEntity.quantity = data.quantity;
            wareHouseEntity.userEntity = _user;
            wareHouseEntity.itemEntity = _item;

            // // save account 
            const _result = await this.wareHouseRepository.save(wareHouseEntity);
            return _result;
        }catch(err){
            console.log("errors",err);
             throw console.log('Can`t create ware house');
        }
    }
    
    // update ware house
    async update( data: UpdateWareHouseDTO): Promise<any> {
       try {
           // check account exists
           const account = await this.wareHouseRepository.findOne({where : {ware_house_id : data.ware_house_id}});
           if (!account)
               throw console.log('Can`t found Account by account_id');

            const _user = await this.userService.getById(data.user_id);
            const _item = await this.itemService.getById(data.item_id);

            const wareHouseEntity = new WareHouseEntity();
            wareHouseEntity.expiry = data.expiry;
            wareHouseEntity.quantity = data.quantity;
            wareHouseEntity.userEntity = _user;
            wareHouseEntity.itemEntity = _item;

           const update = await this.wareHouseRepository.update(data.ware_house_id, wareHouseEntity);
           const result = await this.wareHouseRepository.findOne({where: {ware_house_id: data.ware_house_id}})
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