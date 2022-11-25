import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {OderEntity} from "./oder.entity";
import {Repository} from "typeorm";
import {CreateOderDTO} from "./oder.dto";
import { UserService } from "../users/user.service";
import { OderDetailService } from "../oder-detail/oder-detail.service";
// import { ItemService} from "../item/item.service";


@Injectable()
export class OderService {
    constructor(@InjectRepository(OderEntity) 
        private readonly oderRepository: Repository<OderEntity>,
                private readonly userService: UserService
    ) {}

    // find oder-detail by id
    async getByOderId(oder_id: string): Promise<OderEntity> {
        const data = await this.oderRepository.findOne({
            where: {oder_id: oder_id },
            relations: { userEntity : true }
        });
        
        return data;
    }

    // Find All oder-detail
    async find(): Promise<OderEntity[]> {
        try{
            const data = await this.oderRepository.find({
                //  relations: { oderDetailEntity : true }
            });
            return data;

        }catch(err){
            throw err;
        }
        
    }



    
    // create oder-detail
    async create(data: CreateOderDTO): Promise<OderEntity> {
        try {
           // user
            const user  = await this.userService.getById(data.user_id)

            if (!user){
                throw console.log(`Oder_detail don't exist`);
            }
            

            const oderEntity = new OderEntity();
            oderEntity.userEntity = user;

            // save item 
            const result = await this.oderRepository.save(oderEntity);
            return result;
        }catch(err){
            console.log("errors",err);
             throw console.log('Can`t create Oder');
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
    async delete(oder_id : string): Promise<any> {
        try {
            // check item exists
            const data = await this.oderRepository.findOne({where : {oder_id : oder_id}});
            if (!data)
                throw console.log('Can`t found Warehouse by id');

            // delete
            const result = await this.oderRepository.delete(oder_id);
            return result;
        }catch (err){
            console.log('errors',err);
            throw console.log('Can`t delete Warehouse');
        }
    }
}