import {HttpException, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {OderDetailEntity} from "./oder-detail.entity";
import {Repository} from "typeorm";
import {CreateOderDetailDTO, UpdateOderDetailDTO} from "./oder-detail.dto";


@Injectable()
export class OderDetailService {
    public oderDetailEntity = new OderDetailEntity();
    constructor(
        @InjectRepository(OderDetailEntity) 
        private readonly oderDetailRepository: Repository<OderDetailEntity>,    
    ) {

    }

    //find oder-detail by id
    async getById(oder_detail_id: string): Promise<OderDetailEntity> {
        try{
            const result = await this.oderDetailRepository.findOne({
                where: {oder_detail_id: oder_detail_id },
                relations: { oderEntity : true }
            });
            return result;

        }catch(err){
            console.log(err);
            throw new HttpException('failed', 500);
        }
    }

    // Find All oder-detail
    async find(): Promise<OderDetailEntity[]> {
        try{
            const data = await this.oderDetailRepository.find({
                 relations: { oderEntity : true }
            });
            return data;

        }catch(err){
            console.log(err);
            throw new HttpException('failed', 500);
        } 
    }

    // create oder-detail
    async create (data: CreateOderDetailDTO): Promise<any> {
        try{
            const result = await this.oderDetailRepository.save(data);
            return result;

        }catch(err){
            console.log(err);
            throw new HttpException('failed', 500);
        }
    }

    async update(data: UpdateOderDetailDTO) {
        try{
            const oder_detail = await this.oderDetailRepository.findOne({where : {oder_detail_id : data.oder_detail_id}});
            if (!oder_detail)
                throw new HttpException('Not Found', 404);

            const result = await this.oderDetailRepository.update(data.oder_detail_id,data)
            return result;

        }catch(err){
            console.log(err);
            throw new HttpException('failed', 500);
        }
   }


    // delete oder-detail
    async delete(oder_detail_id : string): Promise<any> {
        try {
            // check oder detail exists
            const oder_detail = await this.oderDetailRepository.findOne({where : {oder_detail_id : oder_detail_id}});
            if (!oder_detail)
                throw new HttpException('Not Found', 404);

            // delete oder detail
            await this.oderDetailRepository.delete(oder_detail_id);
            return oder_detail;

        }catch (err){
            console.log(err);
            throw new HttpException('failed', 500);
        }
    }
}