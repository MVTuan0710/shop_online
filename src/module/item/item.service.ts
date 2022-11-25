import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {ItemEntity} from "./item.entity";
import {Repository} from "typeorm";
import {CreateItemDTO} from "../item/item.dto";
import { CategoryService } from "../categories/category.service";



@Injectable()
export class ItemService {
    public itemEntity = new ItemEntity();
    constructor(@InjectRepository(ItemEntity) 
        private readonly itemRepository: Repository<ItemEntity>,
                private readonly categoryService: CategoryService
    ) {}

    // find item by id
    async getById(item_id: string): Promise<ItemEntity> {
        const data = await this.itemRepository.findOne({
            where: {item_id: item_id },
            relations: { wareHouseEntity : true }
        });
        
        return data;
    }

    async getByName(name: string): Promise<ItemEntity> {
        const accounts = await this.itemRepository.findOne({
            where: {name: name },
            relations: { wareHouseEntity : true }
        });
        return accounts;

    }


    // Find All item
    async find(): Promise<ItemEntity[]> {
        try{
            const data = await this.itemRepository.find({
                //  relations: { categoryEntity : true }
            });
            return data;

        }catch(err){
            throw err;
        }
        
    }
    
    // create item
    async create(data: CreateItemDTO): Promise<ItemEntity> {
        try {
            // check item exists
            const item  = await this.itemRepository.findOne({
                where: {name: data.name },
                // relations: { userEntity : true }
            });;
            if (item){
                throw console.log('The item is exist');
            }
            
            const category = await this.categoryService.getById(data.category_id);

            const itemEntity = new ItemEntity();
            itemEntity.name = data.name;
            itemEntity.price = data.price;
            itemEntity.height = data.height;
            itemEntity.weight = data.weight;
            itemEntity.usage = data.usage;
            itemEntity.categoryEntity =category;

            // // save item 
            const result = await this.itemRepository.save(itemEntity);
            return result;
        }catch(err){
            console.log("errors",err);
             throw console.log('Can`t create Account');
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

            // update account
           const result = await this.itemRepository.update(item_id, itemEntity);
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
            const data = await this.itemRepository.findOne({where : {item_id : item_id}});
            if (!data)
                throw console.log('Can`t found Warehouse by id');

            // delete
            const result = await this.itemRepository.delete(item_id);
            return data;
        }catch (err){
            console.log('errors',err);
            throw console.log('Can`t delete Warehouse');
        }
    }
}