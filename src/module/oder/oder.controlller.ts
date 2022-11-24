import {Body, Controller, Get, Param, Post, Res, UseGuards} from "@nestjs/common";
import {OderService} from "./oder.service";
import {GuardsJwt} from "../auth/guard/guards.jwt";
import {RolesGuard} from "../role/guards/role.guards";
import {EnumRole} from "../constant/role/role.constant";
import {CreateOderDTO} from "./oder.dto"


@Controller('oder-detail')
@UseGuards(GuardsJwt, RolesGuard)
export class OderController{
    constructor(private oderService : OderService) {}

    // find all oder-detail
    // @Roles(EnumRole.super_admin)
    @Get('get-all')
    async getAll(@Res() res){
        return this.oderService.find().then(result =>{
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
    @Post('create')
    async create(@Res() res, @Body() body: CreateOderDTO){
        return this.oderService.create(body).then(result =>{
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
    @Get('get/:oder_detail_id')
    async getById(@Res() res, @Param('oder_detail_id') oder_detail_id : string){
        return this.oderService.getById(oder_detail_id).then(result =>{
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