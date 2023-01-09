import {Body, Controller, Delete, Get, Param, Post, Res, Put, UseGuards, Req} from "@nestjs/common";
import { SaleItemService } from "./sale-item.service";
import {GuardsJwt} from "../auth/guard/guards.jwt";
import {RolesGuard} from "../role/guards/role.guards";
import {EnumRole} from "../constant/role/role.constant";
import { CreateSaleItemDTO } from "./sale-item.dto";
import { Roles } from "../decorator/role.decorator";


@Controller('sale-item')
@UseGuards(GuardsJwt, RolesGuard)
export class SaleItemController{
    constructor(private saleItemService : SaleItemService) {}

    // find all 
    @Get('get-all')
    async getAll(@Res() res){
        return this.saleItemService.find().then(result =>{
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
    @Roles(EnumRole.super_admin, EnumRole.business_manager)
    @Post('create')
    async create(@Res() res, @Body() data: CreateSaleItemDTO, @Req()req){
        data.user_id = req['user'].id;
        return this.saleItemService.create(data).then(result =>{
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

    // delete
    @Roles(EnumRole.super_admin, EnumRole.business_manager)
    @Delete('delete/:sale_id')
    async delete(@Res() res, @Param('sale_id')sale_id:string){
        return this.saleItemService.delete(sale_id).then(result =>{
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
    @Roles(EnumRole.super_admin, EnumRole.business_manager)
    @Put('update/:sale_id')
    async update(@Res() res, @Param('sale_item_id')sale_item_id: string, @Body()data:CreateSaleItemDTO, @Req()req){
        data.user_id = req['user'].id;
        return this.saleItemService.update(sale_item_id,data).then(result =>{
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

    // find by id
    @Get('get/:sale_id')
    async getByOderId(@Res() res, @Param('sale_id') sale_id : string){
        return this.saleItemService.getById(sale_id).then(result =>{
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