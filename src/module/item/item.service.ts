import {HttpException, Injectable,HttpStatus} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {ItemEntity} from "./item.entity";
import {Repository} from "typeorm";
import {CreateItemDTO} from "../item/item.dto";
import { CategoryService } from "../categories/category.service";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../users/user.service";
import { ItemLogService } from "../item-log/item_log.service";
import { ItemLogEntity } from "../item-log/item_log.entity";
// import moment from "moment";
var moment = require('moment');

@Injectable()
export class ItemService {
    public itemEntity = new ItemEntity();
    constructor(@InjectRepository(ItemEntity) 
        private readonly itemRepository: Repository<ItemEntity>,
                private readonly categoryService: CategoryService,
                private readonly userService: UserService,
                private readonly itemLogService: ItemLogService,
                private readonly jwtService : JwtService,

    ) {}

    // find item by id
    async getById(item_id: string, token?: any): Promise<ItemEntity> {
        try{
            const item = await this.itemRepository.findOne({
                where: {item_id: item_id },
                relations: { wareHouseEntity : true }
            });
            if(token.authorization){
                const _token = token.authorization.split(" ");
                const payload = this.jwtService.verify(_token[1]); 
                console.log(payload);
    
                if(payload.role.role_id === 1 || payload.role.role_id === 2|| payload.role.role_id === 3){
                    return item
                }else{
                    const expiry = moment(String(item.wareHouseEntity.expiry)).format('DD/MM/YYYY')
                    const month = moment().add(30, 'days').calendar();
    
                    console.log(expiry,month);
                    
                    if(month == expiry){
                        throw new HttpException('Out of stock', 500);
                    }else{
                        return item;
                    }
                }
            }else{
                const expiry = moment(String(item.wareHouseEntity.expiry)).format('DD/MM/YYYY')
                    const month = moment().add(30, 'days').calendar();
    
                    console.log(expiry,month);
                    
                    if(month == expiry){
                        throw new HttpException('Out of stock', 500);
                    }else{
                        return item;
                    }
            }
            
        }catch(err){
            throw new HttpException('failed',500)
        }
        

        
    }

    async getByName(name: string): Promise<ItemEntity> {
        const item = await this.itemRepository.findOne({
            where: {name: name },
            relations: { wareHouseEntity : true }
        });
        const expiry = moment(String(item.wareHouseEntity.expiry)).format('DD/MM/YYYY')
        const month = moment().add(30, 'days').calendar();

        if(month <= expiry){
            throw new HttpException('Out of stock', 500);
        }else{
            return item;
        }


    }

    //Find All item
    async find(): Promise<ItemEntity[]> {
        try{
            const item = await this.itemRepository.find({
                 relations: { categoryEntity : true }
            });
            return item;
        }catch(err){
            throw err;
        }
        
    }
    
    // create item
    async create(data: CreateItemDTO): Promise<any> {
        try{
            // Check item name exists
            const isItemExists = await this.itemRepository.findOne({where:{name:data.name}})
            if (isItemExists) throw new HttpException('The item already in use', HttpStatus.CONFLICT)
        
            const category = await this.categoryService.getById(data.category_id);
            const user = await this.userService.getByEmail(data.email);
    
            // Create item
                const itemEntity = new ItemEntity();
                itemEntity.name = data.name;
                itemEntity.price = data.price;
                itemEntity.height = data.height;
                itemEntity.weight = data.weight;
                itemEntity.usage = data.usage;
                itemEntity.categoryEntity =category;
                itemEntity.userEntity= user;

            const result = await this.itemRepository.save(itemEntity);

            // Create item_log
                const new_itemLogEntity = new ItemLogEntity();
                new_itemLogEntity.name = itemEntity.name;
                new_itemLogEntity.price = itemEntity.price;
                new_itemLogEntity.userEntity = itemEntity.userEntity;
                new_itemLogEntity.itemEntity = result;
                new_itemLogEntity.categoryEntity = itemEntity.categoryEntity;

            await this.itemLogService.create(new_itemLogEntity)
            return result;

        }catch(err){
            throw new HttpException('The item cannot create', HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }
    
    // update item
    async update(item_id : string, data: CreateItemDTO): Promise<any> {
       try {
           // check category exists
           const _category = await this.categoryService.getById(data.category_id);
           if (!_category)
                throw console.log('Can`t found Category by category_id');

  
                const category = await this.categoryService.getById(data.category_id);
                const user = await this.userService.getByEmail(data.email)
    
                const itemEntity = new ItemEntity();
                itemEntity.name = data.name;
                itemEntity.price = data.price;
                itemEntity.height = data.height;
                itemEntity.weight = data.weight;
                itemEntity.usage = data.usage;
                itemEntity.categoryEntity =category;
                itemEntity.userEntity= user;
                    
            // update item
            const createItemEntity = await this.itemRepository.create(itemEntity);
            const result = await this.itemRepository.update(item_id, itemEntity)

            // Create item_log
                const new_itemLogEntity = new ItemLogEntity();
                new_itemLogEntity.name = itemEntity.name;
                new_itemLogEntity.price = itemEntity.price;
                new_itemLogEntity.userEntity = itemEntity.userEntity;
                new_itemLogEntity.itemEntity = createItemEntity;
                new_itemLogEntity.categoryEntity = itemEntity.categoryEntity;

            await this.itemLogService.create(new_itemLogEntity)

           return result;
       }catch (err){
           console.log('error',err);
           throw console.log('Can`t update item');
       }
    }

    // delete item
    async delete(item_id : string): Promise<any> {
        try {
            // check item exists
            const item = await this.itemRepository.findOne({where : {item_id : item_id}});
            if (!item)
                throw console.log('Can`t found Warehouse by id');

            // delete item
            await this.itemRepository.delete(item_id);
            return item;
        }catch (err){
            console.log('errors',err);
            throw console.log('Can`t delete Warehouse');
        }
    }
}

function define(arg0: string[], arg1: (moment: any) => void) {
    throw new Error("Function not implemented.");
}
