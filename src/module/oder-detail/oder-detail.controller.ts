import {Body, Controller, Get, Param, Post, Res, Delete, UseGuards, Headers, Req} from "@nestjs/common";
import {OderDetailService} from "./oder-detail.service";
// import {GuardsJwt} from "../auth/guard/guards.jwt";
// import {RolesGuard} from "./guards/role.guards";
// import {EnumRole} from "../constant/role/role.constant";
import {CreateOderDetailDTO} from "./oder-detail.dto"
import { Request } from "express";



@Controller('oder-detail')
// @UseGuards(GuardsJwt, RolesGuard)
// @ApiBearerAuth('JWT-auth')
export class OderDetailController{
    constructor(private oderDetailService : OderDetailService) {}

    // find all oder-detail
    // @Roles(EnumRole.super_admin)
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

    // @Roles(EnumRole.super_admin)
    @Post('create')
    async create(@Res() res, @Body() data: CreateOderDetailDTO,@Req() req: Request){
        data.user_id = req['user'].id;
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

    // find role by id
    @Get('get/:oder_detail_id')
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