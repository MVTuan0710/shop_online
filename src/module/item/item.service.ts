import {HttpException, Injectable,HttpStatus} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {ItemEntity} from "./item.entity";
import {Repository} from "typeorm";
import {CreateItemDTO,GetItemDTO} from "../item/item.dto";
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
                private readonly jwtService : JwtService

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
            const item = await this.itemRepository.findOne({
                where: {item_id: data.item_id },
                relations: { wareHouseEntity : true }
            });
            if(data.user_id){
                const user = await this.userService.getById(data.user_id) 

                for(let i= 0;i < item.wareHouseEntity.length ; i++){
                    if(user.roleEntity.role_id === 1 || user.roleEntity.role_id === 2|| user.roleEntity.role_id === 3){
                        return item;
                    }else{
                        const month = moment().add(30, 'days').format('DD/MM/YYYY');
                        const expiry = moment(item.wareHouseEntity[i].expiry).format('DD/MM/YYYY');
                         
                       
                        if(item.wareHouseEntity[i].quantity <= 5){
                            if(month <= expiry){
                                throw new HttpException('Out of stock', 500);
                            }else{
                                return item;
                            }
                        }else{
                            delete item.wareHouseEntity[i].quantity;
                            if(month <= expiry){
                                throw new HttpException('Out of stock', 500);
                            }else{
                                return item;
                            }
                        }
                    }
                }
               

            }else{
                for(let j= 0;j < item.wareHouseEntity.length ; j++){
                    const month = moment().add(30, 'days').format('DD/MM/YYYY');
                    const expiry = moment(item.wareHouseEntity[j].expiry).format('DD/MM/YYYY');
                    
                    if(item.wareHouseEntity[j].quantity <= 5){
                        if(month <= expiry){
                            throw new HttpException('Out of stock', 500);
                        }else{
                            return item;
                        }
                    }else{
                        delete item.wareHouseEntity[j].quantity;
                        if(month <= expiry){
                            throw new HttpException('Out of stock', 500);
                        }else{
                            return item;
                        }
                    }
                }     
            }
            
        }catch(err){
            console.log('errors',err);
            throw new HttpException('Bad req',400);
        }        
}

    async getByName(name: string): Promise<ItemEntity> {
        try{
            const item = await this.itemRepository.findOne({
                where: {name: name },
                relations: { wareHouseEntity : true }
            });
            for(let i=0;i < item.wareHouseEntity.length; i++){
                const expiry = moment(String(item.wareHouseEntity[i].expiry)).format('DD/MM/YYYY')
                const month = moment().add(30, 'days').calendar();
    
                if(item.wareHouseEntity[i].quantity <= 5){
                    if(month <= expiry){
                        throw new HttpException('Out of stock', 500);
                    }else{
                        return item;
                    }
                }else{
                    delete item.wareHouseEntity[i].quantity;
                    if(month <= expiry){
                        throw new HttpException('Out of stock', 500);
                    }else{
                        return item;
                    }
                }
            }
            
        }catch(err){
            console.log('errors',err);
            throw new HttpException('Bad req',400);
        }
       


    }

    //Find All item
    async find(): Promise<ItemEntity[]> {
        try{
            const result: ItemEntity[] = []
            const item = await this.itemRepository.find({
                 relations: { categoryEntity : true }
            }); 
            for(let i = 0; i < item.length; i++){
               for(let j=0;j< item[i].wareHouseEntity.length; i++){
                const expiry = moment(String(item[i].wareHouseEntity[j].expiry)).format('DD/MM/YYYY')
                const month = moment().add(30, 'days').calendar();
                
                if(item[i].wareHouseEntity[j].quantity <= 5){
                    if(month <= expiry){
                        throw new HttpException('Out of stock', 500);
                    }else{
                        result.push(item[i]);
                    }
                }else{
                    delete item[i].wareHouseEntity[j].quantity;
                    if(month <= expiry){
                        throw new HttpException('Out of stock', 500);
                    }else{
                        result.push(item[i]);
                    }
                }
                
            } 
            }
            return result;
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


