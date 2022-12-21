import {HttpException, Injectable,HttpStatus} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {ItemEntity} from "./item.entity";
import {MoreThan, Raw, Repository} from "typeorm";
import {CreateItemDTO,GetItemDTO} from "../item/item.dto";
import { CategoryService } from "../categories/category.service";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../users/user.service";
import { ItemLogService } from "../item-log/item_log.service";
import { ItemLogEntity } from "../item-log/item_log.entity";
// var moment = require('moment');
import * as moment from 'moment'

@Injectable()
export class ItemService {
    public itemEntity = new ItemEntity();
    constructor(@InjectRepository(ItemEntity) 
        private readonly itemRepository: Repository<ItemEntity>,
                private readonly categoryService: CategoryService,
                private readonly userService: UserService,
                private readonly itemLogService: ItemLogService,
    ) {}

    async getByIdNormal(item_id:string): Promise<ItemEntity>{
        try{
            const result = await this.itemRepository.findOne({where: {item_id: item_id}});
            return result;
        }catch(err){
            console.log('errors',err);
            throw new HttpException('Bad req',400);
        }
    }

    // find item by id
    async getById(data: GetItemDTO): Promise<ItemEntity> {
        try{
            const month = moment().add(30, 'days');
            const item = await this.itemRepository.findOne({
                where: {
                    item_id: data.item_id,
                    wareHouseEntity: {
                        expiry: Raw((alias) => `${alias} > :date`, { date: month })
                    }
                },
                relations: { wareHouseEntity : true }
            });
           
            return item;
        }catch(err){
            console.log('errors',err);
            throw new HttpException('Bad req',400);
        }        
}


    //Find All item
    async find(id: string): Promise<ItemEntity[]> {
        try{
            const month = moment().add(30, 'days').toISOString();
            
            // Date();
            const _item = await this.itemRepository.query(`
            select * from (select it.item_id, cast(sum (wh.quantity) as int)  as total
            from public.item as it join public.ware_house as wh on it.item_id = wh.item_id 
            where wh.quantity > 0 and wh.expiry > '${month}'
            group by it.item_id)
            as res inner join public.item as it1 on it1.item_id = res.item_id
            `)

            for(let i = 0;i < _item.length; i++){
                if(_item[i].total > 5){
                    delete _item[i].total;
                }

            }
            if(!_item){
                throw new HttpException('Out of Stock',400);
            }
            return _item;
        }catch(err){
            console.log('errors',err);
            throw new HttpException('Bad req',400);
        }
        
    }
    
    // create item
    async create(data: CreateItemDTO): Promise<any> {
        try{
            // Check item name exists
            const isItemExists = await this.itemRepository.findOne({where:{name:data.name}})
            if (isItemExists) throw new HttpException('The item already in use', HttpStatus.CONFLICT)
        
            const category = await this.categoryService.getById(data.category_id);
    
            // Create item
                const itemEntity = new ItemEntity();
                itemEntity.name = data.name;
                itemEntity.price = data.price;
                itemEntity.height = data.height;
                itemEntity.weight = data.weight;
                itemEntity.usage = data.usage;
                itemEntity.categoryEntity =category;
                

            const result = await this.itemRepository.save(itemEntity);

            // Create item_log
                const new_itemLogEntity = new ItemLogEntity();
                new_itemLogEntity.name = itemEntity.name;
                new_itemLogEntity.price = itemEntity.price;
                new_itemLogEntity.height= itemEntity.height;
                new_itemLogEntity.weight =itemEntity.weight;
                new_itemLogEntity.usage= itemEntity.usage;
                new_itemLogEntity.itemEntity = result;


            await this.itemLogService.create(new_itemLogEntity)
            return result;

        }catch(err){
            console.log('errors',err);
            throw new HttpException('Bad req',400);
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
    
                const itemEntity = new ItemEntity();
                itemEntity.name = data.name;
                itemEntity.price = data.price;
                itemEntity.height = data.height;
                itemEntity.weight = data.weight;
                itemEntity.usage = data.usage;
                itemEntity.categoryEntity =category;
                    
            // update item
            const createItemEntity = await this.itemRepository.create(itemEntity);
            const result = await this.itemRepository.update(item_id, itemEntity)

            // Create item_log
                const new_itemLogEntity = new ItemLogEntity();
                new_itemLogEntity.name = itemEntity.name;
                new_itemLogEntity.price = itemEntity.price;
                new_itemLogEntity.height= itemEntity.height;
                new_itemLogEntity.weight =itemEntity.weight;
                new_itemLogEntity.usage= itemEntity.usage;
                new_itemLogEntity.itemEntity = createItemEntity;


            await this.itemLogService.create(new_itemLogEntity)

           return result;
       }catch (err){
            console.log('errors',err);
            throw new HttpException('Bad req',400);
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
            throw new HttpException('Bad req',400);
        }
    }
}


