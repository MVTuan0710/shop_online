import {Body, Controller, Delete, Get, Param, Post, Put, Req, Res, UseGuards} from "@nestjs/common";
import { ItemService } from "./item.service";
import { CreateItemDTO, GetItemDTO } from "./item.dto";
import { GuardsJwt } from "../auth/guard/guards.jwt";
import { RolesGuard } from "../role/guards/role.guards";
import { Roles } from '../decorator/role.decorator';
import { EnumRole } from '../constant/role/role.constant'
import { Request, Response } from "express";

@Controller('item')
@UseGuards(GuardsJwt,RolesGuard)
export class ItemController{
    constructor(private itemService  : ItemService) {}

    // get all 
    @Get('get-all')
    async getAll(@Res() res: Response,@Req()req: Request) : Promise<any>{
        const role_id = req['user'].role_id;
        return this.itemService.find(role_id).then(result =>{
            res.status(200).json({
                message : 'success',
                result,
            });
        }).catch(err =>{
            res.status(500).json({
                message : 'failed',
                err,
            })
        })
    }

    // get by Id
    @Get('/get-id/:item_id')
    async getByID(@Res() res,@Body()data: GetItemDTO, @Req()req: Request, @Param('item_id')
    item_id : string) : Promise<any>{
        data.role_id = req['user'].role_id;
        data.item_id =item_id
        return this.itemService.getById(data).then(result =>{
            res.status(200).json({
                message : 'success',
                result
            });
        }).catch(err =>{
            res.status(500).json({
                message : 'failed',
                err,
            })
        })
    }

    //create item
    @Roles(EnumRole.super_admin, EnumRole.business_manager)
    @Post('create')
    async create(@Res() res, @Body()data: CreateItemDTO, @Req() req) : Promise<any>{
        data.user_id = req['user'].id;
        return this.itemService.create(data).then(result =>{
            res.status(200).json({
                message : 'success',
                result,
            });
        }).catch(err =>{
            res.status(500).json({
                message : 'failed',
                err,
            })
        })
    }

    // update item
    @Roles(EnumRole.super_admin, EnumRole.business_manager)
    @Put('update/:item_id')
    async put(@Body() data : CreateItemDTO, @Res() res, @Req() req, @Param('item_id')
    item_id : string ): Promise<any> {
        data.user_id = req['user'].id;
        return this.itemService.update(item_id, data).then(result =>{
            res.status(200).json({
                message : 'success',
                result,
            });
        }).catch(err =>{
            console.log();
            res.status(500).json({
                message : 'failed',
                err,
            });
        })
    }

    // delete item
    @Roles(EnumRole.super_admin)
    @Delete('delete/:item_id')
    async delete(@Res() res , @Param('item_id') item_id : string) : Promise<any>{
        return this.itemService.delete(item_id).then(result =>{
            res.status(200).json({
                message : 'success',
                result,
            });
        }).catch(err => {
            res.status(500).json({
                message : 'fail',
                err,
            });
        })
    }
}