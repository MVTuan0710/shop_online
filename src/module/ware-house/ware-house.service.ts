import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {WareHouseEntity} from "./ware-house.entity";
import { MoreThan, QueryRunner, Raw, Repository} from "typeorm";
import { CreateWareHouseDTO, UpdateWareHouseDTO, ArrayWarehouse} from "./ware-house.dto";
import { UserService } from "../users/user.service";
import { ItemService } from "../item/item.service";
import { OderDetailEntity } from "../oder-detail/oder-detail.entity";
import {WareHouseLogEntity} from "../ware-house-log/ware-house-log.entity";
import {WareHouseLogService} from "../ware-house-log/ware-house-log.servic";
import * as moment from 'moment';


@Injectable()
export class WareHouseService {
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
            console.log(err);
            throw new HttpException('Bad req',HttpStatus.BAD_REQUEST);
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
            console.log(err);
            throw new HttpException('Bad req',HttpStatus.BAD_REQUEST);
        }
    }

    // Find All warehouse
    async find(): Promise<WareHouseEntity[]> {
        try{
            const result = await this.wareHouseRepository.find({
                relations: { itemEntity: true, userEntity: true } 
            });
            return result;

        }catch(err){
            console.log(err);
            throw new HttpException('Bad req',HttpStatus.BAD_REQUEST);
        }
        
    }
    
    // create warehouse
    async create( data: CreateWareHouseDTO): Promise<WareHouseEntity> {
        try {
            // check id exists
            const user  = await this.userService.getById(data.create_at);
            if (!user){
                throw console.log('Not found',HttpStatus.NOT_FOUND);
            }

            const _user = await this.userService.getById(data.create_at);
            const _item = await this.itemService.getByIdNormal(data.item_id);

            const wareHouseEntity = new WareHouseEntity();
            wareHouseEntity.expiry = data.expiry;
            wareHouseEntity.quantity = data.quantity;
            wareHouseEntity.userEntity = _user;
            wareHouseEntity.itemEntity = _item;

            // save warehouse
            const _result = await this.wareHouseRepository.save(wareHouseEntity);

            const new_wareHouseLogEntity = new WareHouseLogEntity();
            new_wareHouseLogEntity.expiry = wareHouseEntity.expiry;
            new_wareHouseLogEntity.quantity= wareHouseEntity.quantity;
            new_wareHouseLogEntity.wareHouseEntity = _result;

            await this.wareHouseLogService.create(new_wareHouseLogEntity);
            return _result;

        }catch(err){
            console.log(err);
            throw new HttpException('Bad req',HttpStatus.BAD_REQUEST);
        }
    }

    // cap nhat nay se khong cap nhat lai user da tao record ware house
    // => kh co truong user_id
    // quantity can mua
    async updateByOder(data: OderDetailEntity[], queryRunner: QueryRunner): Promise<any>{
        try{  
            const month = moment().add(30, 'days');
            let result:ArrayWarehouse[] = [];
            // const oder = await this.oderService.getByOderId(oder_id);
            // const oder = await this.oderService.getByOderId(oder_id);

            for(let i = 0; i< data.length; i++){
                let quantity = data[i].quantity;

                const ware_house = await this.wareHouseRepository.find(({
                    where: {
                        itemEntity: {item_id: data[i].item_id},
                        quantity: MoreThan(0),
                        expiry: Raw((alias) => `${alias} > :date`, { date: month })
                    },
                    
                    relations: { itemEntity: true},
                    order:{
                        expiry: "ASC"
                    }
                }))
                
                for(let j = 0; j < ware_house.length; j++){
                    console.log(ware_house[j].quantity);
                    
                    if(quantity- ware_house[j].quantity > 0){
                        const new_array_warehouse = new ArrayWarehouse();
                        new_array_warehouse.ware_house_id = ware_house[j].ware_house_id;
                        new_array_warehouse.item_id = data[i].item_id;
                        new_array_warehouse.quantity = ware_house[j].quantity;
                        result.push (new_array_warehouse);

                        quantity = quantity - ware_house[j].quantity;
                        ware_house[j].quantity = 0;

                        const new_ware_house = new WareHouseEntity();
                        new_ware_house.expiry = ware_house[j].expiry;
                        new_ware_house.quantity = ware_house[j].quantity;
                        new_ware_house.itemEntity= ware_house[j].itemEntity;
                        new_ware_house.userEntity = ware_house[j].userEntity;

                        continue;
                    }
                    
                    if(quantity- ware_house[j].quantity == 0){
                        const new_array_warehouse = new ArrayWarehouse();
                        new_array_warehouse.ware_house_id = ware_house[j].ware_house_id;
                        new_array_warehouse.item_id = data[i].item_id;
                        new_array_warehouse.quantity = quantity;
                        result.push (new_array_warehouse);
                        
                        quantity = 0;
                        ware_house[j].quantity = 0;

                        const new_ware_house = new WareHouseEntity();
                        new_ware_house.expiry = ware_house[j].expiry;
                        new_ware_house.quantity = ware_house[j].quantity;
                        new_ware_house.itemEntity= ware_house[j].itemEntity;
                        new_ware_house.userEntity = ware_house[j].userEntity;

                        break;
                    }

                    if(quantity - ware_house[j].quantity < 0){
                        const new_array_warehouse = new ArrayWarehouse();
                        new_array_warehouse.ware_house_id = ware_house[j].ware_house_id;
                        new_array_warehouse.item_id = data[i].item_id;
                        new_array_warehouse.quantity = quantity;
                        result.push (new_array_warehouse);

                        ware_house[j].quantity = ware_house[j].quantity - quantity ;
                        quantity= 0;

                        const new_ware_house = new WareHouseEntity();
                        new_ware_house.expiry = ware_house[j].expiry;
                        new_ware_house.quantity = ware_house[j].quantity;
                        new_ware_house.itemEntity= ware_house[j].itemEntity;
                        new_ware_house.userEntity = ware_house[j].userEntity;

                        break;
                    }  
                }
                if(quantity > 0){
                    throw new HttpException(`Out of strock`, HttpStatus.BAD_REQUEST);
                }
            }
            return result;
        }catch(err){
            console.log(err);
            throw new HttpException('Bad req',HttpStatus.BAD_REQUEST);
        }

    }
    // update ware house, update ca user tao ra ware house
    async update( data: UpdateWareHouseDTO): Promise<any> {
       try {
           // check account exists
            const warehouse = await this.wareHouseRepository.findOne({where : {ware_house_id : data.ware_house_id}});
            if (!warehouse){
                throw console.log('Not found',HttpStatus.NOT_FOUND);
            }
               

            const _user = await this.userService.getById(data.create_at);
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
            console.log(err);
            throw new HttpException('Bad req',HttpStatus.BAD_REQUEST);
        }
    }

    // delete ware house
    async delete(ware_house_id : string): Promise<any> {
        try {
            // check warehouse exists
            const data = await this.wareHouseRepository.findOne({where : {ware_house_id : ware_house_id}});
            if (!data){
                throw console.log('Not found',HttpStatus.NOT_FOUND);
            }
                
            // delete
            await this.wareHouseRepository.delete(ware_house_id);
            return data;

        }catch (err){
            console.log(err);
            throw new HttpException('Bad req',HttpStatus.BAD_REQUEST);
        }
    }
}