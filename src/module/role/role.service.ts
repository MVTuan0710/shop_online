import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {RoleEntity} from "./role.entity";
import {In, Repository} from "typeorm";
import { CreateRoleDTO } from "./role.dto";

@Injectable()
export class RoleService{
    constructor(@InjectRepository(RoleEntity) private roleRepository : Repository<RoleEntity>) {}

    // get all Role
    async getAllRole():Promise<RoleEntity[]> {
        return this.roleRepository.find();
    }

    async findById(id : number): Promise<RoleEntity> {
        return this.roleRepository.findOne({where : { id : id }});
    }

    async createRole(_data: CreateRoleDTO): Promise<RoleEntity>{
        const role = await this.roleRepository.findOne({where : {id : _data.id}});
            if (role){
                throw console.log('The role is exsit');
            }
        const result = await this.roleRepository.save(_data);
        return result;
    }

}