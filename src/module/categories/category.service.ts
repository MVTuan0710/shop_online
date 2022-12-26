import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {CategoryEntity} from "../categories/category.entity";
import {Repository} from "typeorm";
import {CreateCategoryDTO} from "../categories/category.dto";


@Injectable()
export class CategoryService {
    constructor(@InjectRepository(CategoryEntity) 
        private readonly categoryRepository: Repository<CategoryEntity>
    ) {}

    // Find all
    async find(): Promise<CategoryEntity[]> {
        try{
            const data = await this.categoryRepository.find();
            return data;
            
        }catch(err){
            console.log(err);
            throw new HttpException('Bad req',HttpStatus.BAD_REQUEST);
        }
        
    }
    
    // get by id
    async getById(category_id: string): Promise<CategoryEntity>{
        try{
            const result = await this.categoryRepository.findOne({
                where: {category_id: category_id}
            })
            return result;   

        }catch(err){
            console.log(err);
            throw new HttpException('Bad req',HttpStatus.BAD_REQUEST);
        }
   }

    // create
    async create(data: CreateCategoryDTO): Promise<CategoryEntity> {
        try {
            // check category exists
            const category  = await this.categoryRepository.findOne({
                where: {name: data.name },
            });
            if (category){
                throw new HttpException('The category is exist',HttpStatus.BAD_REQUEST);
            }

            // save 
            const result = await this.categoryRepository.save(data);
            return result;

        }catch(err){
            console.log(err);
            throw new HttpException('Bad req',HttpStatus.BAD_REQUEST);
        }
    }
    
    // update 
    async update(category_id : string, data: CreateCategoryDTO): Promise<any> {
       try {
           // check exists
           const categories = await this.categoryRepository.findOne({where : {category_id : category_id}});
           if (!categories){
                throw new HttpException('Can`t found Category by category_id',HttpStatus.BAD_REQUEST);
           }
            // update
           const result = await this.categoryRepository.update(category_id, data);
           return result;

       }catch (err){
            console.log(err);
            throw new HttpException('Bad req',HttpStatus.BAD_REQUEST);
       }
    }

    // delete 
    async delete(category_id : string): Promise<any> {
        try {
            // check category exists
            const data = await this.categoryRepository.findOne({where : {category_id:category_id}});
            if (!data){
                throw new HttpException('Can`t found Category by category_id',HttpStatus.BAD_REQUEST);
            }
            // delete 
            const result = await this.categoryRepository.delete(category_id);
            return result;

        }catch (err){
            console.log(err);
            throw new HttpException('Bad req',HttpStatus.BAD_REQUEST);
        }
    }
}