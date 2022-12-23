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

    // find all oder-detail
    @Roles(EnumRole.super_admin)
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

    // create sale
    @Roles(EnumRole.super_admin)
    @Post('create')
    async create(@Res() res, @Body() data: CreateSaleItemDTO, @Req()req){
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

    // delete sale
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

    // update sale
    @Put('update/:sale_id')
    async update(@Res() res, @Param('sale_id')sale_id:string, @Body()data:CreateSaleItemDTO){
        return this.saleItemService.update(sale_id,data).then(result =>{
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

    // find sale by id
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