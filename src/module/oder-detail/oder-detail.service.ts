import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {OderDetailEntity} from "./oder-detail.entity";
import {Repository} from "typeorm";
import {CreateOderDetailDTO} from "./oder-detail.dto";
import { CategoryService } from "../categories/category.service";
import { ItemService} from "../item/item.service";


@Injectable()
export class OderDetailService {
    public oderDetailEntity = new OderDetailEntity();
    constructor(@InjectRepository(OderDetailEntity) 
        private readonly oderDetailRepository: Repository<OderDetailEntity>,
                private readonly itemService: ItemService
    ) {}

    // find oder-detail by id
    async getById(oder_detail_id: string): Promise<OderDetailEntity> {
        const data = await this.oderDetailRepository.findOne({
            where: {oder_detail_id: oder_detail_id },
            relations: { itemEntity : true }
        });
        
        return data;
    }

    // Find All oder-detail
    async find(): Promise<OderDetailEntity[]> {
        try{
            const data = await this.oderDetailRepository.find({
                 relations: { itemEntity : true }
            });
            return data;

        }catch(err){
            throw err;
        }
        
    }
    
    // create oder-detail
    async create(data: CreateOderDetailDTO): Promise<OderDetailEntity> {
        try {
            // check item exists
            const item  = await this.itemService.getById(data.item_id)

            const _total_money = item.price * data.quantity;

            if (!item){
                throw console.log(`The item don't exist`);
            }

            const oderDetailEntity = new OderDetailEntity();
            oderDetailEntity.quantity = data.quantity;
            oderDetailEntity.itemEntity = item;
            oderDetailEntity.total_money = _total_money;

            // save item 
            const result = await this.oderDetailRepository.save(oderDetailEntity);
            return result;
        }catch(err){
            console.log("errors",err);
             throw console.log('Can`t create Account');
        }
    }
    
    // // update oder-detail
    // async update(item_id : string, data: CreateItemDTO): Promise<any> {
    //    try {
    //        // check category exists
    //        const _category = await this.categoryService.getById(data.category_id);
    //        if (!_category)
    //            throw console.log('Can`t found Category by category_id');

  
    //            const category = await this.categoryService.getById(data.category_id);

    //            const itemEntity = new ItemEntity();
    //            itemEntity.name = data.name;
    //            itemEntity.price = data.price;
    //            itemEntity.height = data.height;
    //            itemEntity.weight = data.weight;
    //            itemEntity.usage = data.usage;
    //            itemEntity.categoryEntity =category;

    //         // update account
    //        const result = await this.itemRepository.update(item_id, itemEntity);
    //        return result;
    //    }catch (err){
    //        console.log('error',err);
    //        throw console.log('Can`t update item');
    //    }
    // }

    // delete oder-detail
    async delete(oder_detail_id : string): Promise<any> {
        try {
            // check item exists
            const data = await this.oderDetailRepository.findOne({where : {oder_detail_id : oder_detail_id}});
            if (!data)
                throw console.log('Can`t found Warehouse by id');

            // delete
            const result = await this.oderDetailRepository.delete(oder_detail_id);
            return data;
        }catch (err){
            console.log('errors',err);
            throw console.log('Can`t delete Warehouse');
        }
    }
}