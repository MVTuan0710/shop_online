import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {RoleEntity} from "./role.entity";
import {Repository} from "typeorm";
import { CreateRoleDTO } from "./role.dto";
import * as Sentry from '@sentry/node';
@Injectable()
export class RoleService{
    constructor(@InjectRepository(RoleEntity) private roleRepository : Repository<RoleEntity>) {}

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
            const role = await this.roleRepository.findOne({where : {role_id : 1}});
            if (role){
                throw new HttpException('The role is exsit',HttpStatus.BAD_REQUEST);
            }

            const result = await this.roleRepository.save(_data);
            return result;
        }catch(err){
            console.log(err);
            //@ts-ignore
            Sentry.captureException(err)
            throw new HttpException('Bad req',HttpStatus.BAD_REQUEST);
        }
    }
}