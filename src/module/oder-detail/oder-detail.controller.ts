import {Body, Controller, Get, Param, Post, Res, Delete, UseGuards, Req, Put} from "@nestjs/common";
import {OderDetailService} from "./oder-detail.service";
import {GuardsJwt} from "../auth/guard/guards.jwt";
import {RolesGuard} from "../role/guards/role.guards";
import {EnumRole} from "../constant/role/role.constant";
import {CreateOderDetailDTO, UpdateOderDetailDTO} from "./oder-detail.dto";
import { Request } from "express";
import { Roles } from "../decorator/role.decorator";


@Controller('oder-detail')
@UseGuards(GuardsJwt, RolesGuard)
export class OderDetailController{
    constructor(private oderDetailService : OderDetailService) {}

    // find all 
    @Roles(EnumRole.super_admin)
    @Get('get-all')
    async getAll(@Res() res){
        return this.oderDetailService.find().then(result =>{
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

    // create 
    @Roles(EnumRole.super_admin)
    @Post('create')
    async create(@Res() res, @Body() data: CreateOderDetailDTO){
        return this.oderDetailService.create(data).then(result =>{
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

    // update
    @Roles(EnumRole.super_admin)
    @Put('update')
    async update(@Res() res, @Body() data: UpdateOderDetailDTO,@Req() req: Request){
        return this.oderDetailService.update(data).then(result =>{
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

    // get by id
    @Get('get-by-id/:oder_detail_id')
    async getById(@Res() res, @Param('oder_detail_id') oder_detail_id : string){
        return this.oderDetailService.getById(oder_detail_id).then(result =>{
            res.status(200).json({
                message : 'success',
                result,
            });
        }).catch(err =>{
            res.status(500).json({
                message : 'failed',
                err
            });
        })
    }

    // delete
    @Delete('delete/:oder_detail_id')
    async delete(@Res() res, @Param('oder_detail_id')oder_detail_id: string){
        return this.oderDetailService.delete(oder_detail_id).then(result =>{
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