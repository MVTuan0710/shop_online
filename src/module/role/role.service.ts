import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {RoleEntity} from "./role.entity";
import {Repository} from "typeorm";
import { CreateRoleDTO } from "./role.dto";

@Injectable()
export class RoleService{
    constructor(@InjectRepository(RoleEntity) private roleRepository : Repository<RoleEntity>) {}

    // get all 
    async getAllRole():Promise<RoleEntity[]> {
        try{
            return this.roleRepository.find();

       }catch(err){
           console.log(err);
           throw new HttpException('Bad req',HttpStatus.BAD_REQUEST);
       }
    }

    async findById(id : number): Promise<RoleEntity> {
        try{
            return this.roleRepository.findOne({where : { role_id : id }});

        }catch(err){
            console.log(err);
            throw new HttpException('Bad req',HttpStatus.BAD_REQUEST);
        }
       
    }

    async createRole(_data: CreateRoleDTO): Promise<RoleEntity>{
        try{
            const role = await this.roleRepository.findOne({where : {role_id : _data.role_id}});
            if (role){
                throw console.log('The role is exsit');
            }

            const result = await this.roleRepository.save(_data);
            return result;
        }catch(err){
            console.log(err);
            throw new HttpException('Bad req',HttpStatus.BAD_REQUEST);
        }
       
    }
}