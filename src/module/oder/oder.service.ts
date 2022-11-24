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
                private readonly oderDetailService: OderDetailService,
                private readonly userService: UserService
    ) {}

    // find oder-detail by id
    async getById(oder_id: string): Promise<OderEntity> {
        const data = await this.oderRepository.findOne({
            where: {oder_id: oder_id },
            relations: { oderDetailEntity : true }
        });
        
        return data;
    }

    // Find All oder-detail
    async find(): Promise<OderEntity[]> {
        try{
            const data = await this.oderRepository.find({
                 relations: { oderDetailEntity : true }
            });
            return data;

        }catch(err){
            throw err;
        }
        
    }
    
    // create oder-detail
    async create(data: CreateOderDTO): Promise<OderEntity> {
        try {
            // check item exists
            const oder_detail  = await this.oderDetailService.getById(data.oder_detail_id)

            if (!oder_detail){
                throw console.log(`Oder_detail don't exist`);
            }
            // user oder detail
            const user = await this.userService.getById(data.user_id)
            const _oder_detail = await this.oderDetailService.getById(data.oder_detail_id)

            const oderEntity = new OderEntity();
            oderEntity.userEntity = user;
            oderEntity.oderDetailEntity = _oder_detail;

            // save item 
            const result = await this.oderRepository.save(oderEntity);
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

    // // delete oder-detail
    // async delete(oder_detail_id : string): Promise<any> {
    //     try {
    //         // check item exists
    //         const data = await this.oderDetailRepository.findOne({where : {oder_detail_id : oder_detail_id}});
    //         if (!data)
    //             throw console.log('Can`t found Warehouse by id');

    //         // delete
    //         const result = await this.oderDetailRepository.delete(oder_detail_id);
    //         return data;
    //     }catch (err){
    //         console.log('errors',err);
    //         throw console.log('Can`t delete Warehouse');
    //     }
    // }
}