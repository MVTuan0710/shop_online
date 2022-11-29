import {Body, Controller, Delete, Get, Param, Post, Put, Query, Req, Res, UseGuards} from "@nestjs/common";
import {ItemService} from "./item.service";
import {CreateItemDTO} from "./item.dto";
import {GuardsJwt} from "../auth/guard/guards.jwt";
import { RolesGuard } from "../role/guards/role.guards";
import { Roles } from '../decorator/role.decorator';
import { EnumRole } from '../constant/role/role.constant'

@Controller('item')
// @UseGuards(GuardsJwt, RolesGuard)
export class ItemController{
    constructor(private itemService  : ItemService) {}

    // get all item
    // @Roles(EnumRole.user)
    @Get('get-all')
    async getAll(@Res() res) : Promise<any>{
        return this.itemService.find().then(result =>{
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

    // get item by Id
    // @Roles(EnumRole.super_admin)
    @Get('/id/:item_id')
    async getWareHouseByID(@Res() res, @Param('item_id') item_id : string) : Promise<any>{
        return this.itemService.getById(item_id).then(result =>{
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

    //create item
    // @Roles(EnumRole.super_admin, EnumRole.business_manager)
    @Post('create')
    async createWareHouse(@Res() res, @Body()data: CreateItemDTO) : Promise<any>{
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
    // @Roles(EnumRole.super_admin, EnumRole.business_manager)
    @Put('update/:item_id')
    async putAccount(@Body() body : CreateItemDTO, @Res() res, @Param('item_id')
    item_id : string ): Promise<any> {
        return this.itemService.update(item_id, body).then(result =>{
            res.status(200).json({
                message : 'Account is updated',
                result,
            });
        }).catch(err =>{
            console.log();
            res.status(500).json({
                message : 'update failed',
                err,
            });
        })
    }

    // delete item
    // @Roles(EnumRole.super_admin)
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