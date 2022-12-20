import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {CategoryEntity} from "../categories/category.entity";
import {Repository} from "typeorm";
import {CreateCategoryDTO} from "../categories/category.dto";


@Injectable()
export class CategoryService {
    public categoryEntity = new CategoryEntity();
    constructor(@InjectRepository(CategoryEntity) 
        private readonly categoryRepository: Repository<CategoryEntity>
    ) {}

    // Find All category
    async find(): Promise<CategoryEntity[]> {
        try{
            const data = await this.categoryRepository.find();
            return data;
        }catch(err){
            throw err;
        }
        
    }
    
    // get category by id
    async getById(category_id: string): Promise<CategoryEntity>{
        try{
            const category = await this.categoryRepository.findOne({
                where: {category_id: category_id}
            })
            return category;    
        }catch(err){
            throw err;
            
        }
   }

    // create category
    async create(data: CreateCategoryDTO): Promise<CategoryEntity> {
        try {
            // check category exists
            const category  = await this.categoryRepository.findOne({
                where: {name: data.name },
            });;
            if (category){
                throw console.log('The category is exist');
            }

            // save categoruy 
            const result = await this.categoryRepository.save(data);
            return result;
        }catch(err){
            console.log("errors",err);
             throw console.log('Can`t create Category');
        }
    }
    
    // update category
    async update(category_id : string, data: CreateCategoryDTO): Promise<any> {
       try {
           // check category exists
           const _data = await this.categoryRepository.findOne({where : {category_id : category_id}});
           if (!_data)
               throw console.log('Can`t found Category by category_id');
            // update category
           const result = await this.categoryRepository.update(category_id, data);
           return result;
       }catch (err){
           console.log('error',err);
           throw console.log('Can`t update Category');
       }
    }

    // delete category
    async delete(category_id : string): Promise<any> {
        try {
            // check category exists
            const data = await this.categoryRepository.findOne({where : {category_id:category_id}});
            if (!data)
                throw console.log('Can`t found Category by category_id');

            // delete category
            const result = await this.categoryRepository.delete(category_id);
            return result;
        }catch (err){
            console.log('errors',err);
            throw console.log('Can`t delete Category');
        }
    }
}