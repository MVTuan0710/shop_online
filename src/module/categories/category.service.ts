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
            if(result == null){
                throw new HttpException('Not found category',HttpStatus.NOT_FOUND);
            }
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
                where: {name: data.name }
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
           const categories = await this.categoryRepository.findOne({where: {category_id: category_id}});
            if (!categories){
                throw new HttpException('Can`t found Category by category_id',HttpStatus.BAD_REQUEST);
            }
            if (categories.name == data.name){
                throw new HttpException('The category is exist',HttpStatus.BAD_REQUEST);
            }
            // update
           await this.categoryRepository.update(category_id, data);
           const new_categories = await this.categoryRepository.findOne({where: {category_id: category_id}});
           return new_categories;

       }catch (err){
            console.log(err);
            throw new HttpException('Bad req',HttpStatus.BAD_REQUEST);
       }
    }

    // delete 
    async delete(category_id : string): Promise<any> {
        try {
            // check category exists
            const categories = await this.categoryRepository.findOne({where : {category_id:category_id}});
            if (!categories){
                throw new HttpException('Can`t found Category by category_id',HttpStatus.BAD_REQUEST);
            }
            // delete 
            await this.categoryRepository.delete(category_id);
            return categories;

        }catch (err){
            console.log(err);
            throw new HttpException('Bad req',HttpStatus.BAD_REQUEST);
        }
    }
}