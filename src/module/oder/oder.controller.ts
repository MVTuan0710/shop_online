import {Body, Controller, Delete, Get, Param, Post, Res, UseGuards, Req} from "@nestjs/common";
import {OderService} from "./oder.service";
import {GuardsJwt} from "../auth/guard/guards.jwt";
import {EnumRole} from "../constant/role/role.constant";
import {CreateOderDTO} from "./oder.dto"
import { Roles } from "../decorator/role.decorator";


@Controller('oder')
@UseGuards(GuardsJwt)
export class OderController{
    constructor(private oderService : OderService) {}

    // find all 
    @Roles(EnumRole.super_admin)
    @Get('get-all')
    async getAll(@Res() res){
        return this.oderService.find().then(result =>{
            res.status(200).json({
                message : 'successful',
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
    @Post('create')
    async create(@Res() res, @Body() data: CreateOderDTO, @Req() req){
        data.user_id = req['user'].id;
        return this.oderService.create(data).then(result =>{
            res.status(200).json({
                message : 'successful',
                result,
            });
        }).catch(err =>{
            res.status(500).json({
                message : 'failed',
                err,
            });
        })
    }

    // // delete
    // @Delete('delete/:oder_id')
    // async delete(@Res() res, @Param('oder_id')oder_id:string, @Body() data: CreateOderDTO){
    //     return this.oderService.delete(data,oder_id).then(result =>{
    //         res.status(200).json({
    //             message : 'successful',
    //             result,
    //         });
    //     }).catch(err =>{
    //         res.status(500).json({
    //             message : 'failed',
    //             err,
    //         });
    //     })
    // }

    // get by id
    @Get('get/:oder_id')
    async getByOderId(@Res() res, @Param('oder_id') oder_id : string){
        return this.oderService.getByOderId(oder_id).then(result =>{
            res.status(200).json({
                message : 'successful',
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