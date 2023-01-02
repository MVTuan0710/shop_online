import {Body, Controller, Get, Param, Post, Res, UseGuards} from "@nestjs/common";
import {RoleService} from "./role.service";
import {Roles} from "../decorator/role.decorator";
import {GuardsJwt} from "../auth/guard/guards.jwt";
import {RolesGuard} from "./guards/role.guards";
import {EnumRole} from "../constant/role/role.constant";
import {CreateRoleDTO} from "./role.dto";


@Controller('role')
// @UseGuards(GuardsJwt, RolesGuard)
export class RoleController{
    constructor(private roleService : RoleService) {}

    // get all role
    @Roles(EnumRole.super_admin)
    @Get('/get-all')
    async getAllRole(@Res() res){
        return this.roleService.getAllRole().then(result =>{
            res.status(200).json({
                message : 'success',
                result,
            });
        }).catch(err =>{
            res.status(500).json({
                message : 'failed',
                err,
            });
        })
    }

    // @Roles(EnumRole.super_admin)
    @Post('/create')
    async createRole(@Res() res, @Body() body: CreateRoleDTO){
        return this.roleService.createRole(body).then(result =>{
            res.status(200).json({
                message : 'success',
                result,
            });
        }).catch(err =>{
            res.status(500).json({
                message : 'failed',
                err,
            });
        })
    }

    // find role by id
    @Get('/:id')
    async getRoleByID(@Res() res, @Param('id') id : number){
        return this.roleService.findById(id).then(result =>{
            res.status(200).json({
                message : 'success',
                result,
            });
        }).catch(err =>{
            res.status(500).json({
                message : 'failed',
                err,
            });
        })
    }
}