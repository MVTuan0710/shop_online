import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {OderEntity} from "./oder.entity";
import {Repository} from "typeorm";
import {CreateOderDTO} from "./oder.dto";
import { UserService } from "../users/user.service";
import { OderDetailService } from "../oder-detail/oder-detail.service";



@Injectable()
export class OderService {
    constructor(@InjectRepository(OderEntity) 
        private readonly oderRepository: Repository<OderEntity>,
        private readonly userService: UserService,
        private readonly oderDetailService: OderDetailService
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
    // async create(data: CreateOderDTO): Promise<OderEntity> {
    //     try {
    //        // user
    //         const user  = await this.userService.getById(data.user_id)

    //         if (!user){
    //             throw console.log(`Oder_detail don't exist`);
    //         }
            

    //         const oderEntity = new OderEntity();
    //         // oderEntity.oder_item = data.oder_item
    //         oderEntity.userEntity = user;

    //         for(let i = 0; i<data.oder_item.length; i++){
    //             await this.oderDetailService.create(data[i].oder_item)
    //         }

    //         // save oder 
    //         const result = await this.oderRepository.save(oderEntity);

    //         return result;
    //     }catch(err){
    //         console.log("errors",err);
    //          throw console.log('Can`t create Oder');
    //     }
    // }
    
    // update oder-detail
    async update(oder_id : string, data: CreateOderDTO): Promise<any> {
       try {
           // user
           const user  = await this.userService.getById(data.user_id)

           if (!user){
               throw console.log(`Oder_detail don't exist`);
           }

           const oderEntity = new OderEntity();
            oderEntity.userEntity = user;

            // update account
            const result = await this.oderRepository.update(oder_id,oderEntity);
            return result;
       }catch (err){
           console.log('error',err);
           throw console.log('Can`t update item');
       }
    }

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