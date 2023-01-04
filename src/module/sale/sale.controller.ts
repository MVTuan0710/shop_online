import {Body, Controller, Delete, Get, Param, Post, Res, Put, UseGuards,} from "@nestjs/common";
import { SaleService } from "./sale.service";
import {GuardsJwt} from "../auth/guard/guards.jwt";
import {RolesGuard} from "../role/guards/role.guards";
import {EnumRole} from "../constant/role/role.constant";
import { CreateSaleDTO } from "./sale.dto";
import { Roles } from "../decorator/role.decorator";


@Controller('sale')
@UseGuards(GuardsJwt, RolesGuard)
export class SaleController{
    constructor(private saleService : SaleService) {}

    // find all 
    @Roles(EnumRole.super_admin, EnumRole.business_manager)
    @Get('get-all')
    async getAll(@Res() res){
        return this.saleService.find().then(result =>{
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
    async create(@Res() res, @Body() data: CreateSaleDTO){
        return this.saleService.create(data).then(result =>{
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
        return this.saleService.delete(sale_id).then(result =>{
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
    async update(@Res() res, @Param('sale_id')sale_id:string, @Body()data:CreateSaleDTO){
        return this.saleService.update(sale_id,data).then(result =>{
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
        return this.saleService.getById(sale_id).then(result =>{
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

    //find by code
    @Get('get-by-code/:voucher_code')
    async getByCode(@Res() res, @Param('voucher_code') voucher_code : string){
        return this.saleService.getByCode(voucher_code).then(result =>{
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