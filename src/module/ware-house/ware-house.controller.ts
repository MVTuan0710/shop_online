import {Body, Controller, Delete, Get, Headers, Param, Post, Put, Query, Req, Res, UseGuards} from "@nestjs/common";
import {WareHouseService} from "./ware-house.service";
import {CreateWareHouseDTO, UpdateWareHouseDTO} from "./ware-house.dto";
import {GuardsJwt} from "../auth/guard/guards.jwt";
import { RolesGuard } from "../role/guards/role.guards";
import { Roles } from '../decorator/role.decorator';
import { EnumRole } from '../constant/role/role.constant';


@Controller('ware-house')
@UseGuards(GuardsJwt, RolesGuard)
export class WareHouseController{
    constructor(private wareHouseService  : WareHouseService) {}

    // get all ware house
    @Roles(EnumRole.warehouse_manager, EnumRole.super_admin)
    @Get('get-all')
    async getAll(@Res() res) : Promise<any>{
        return this.wareHouseService.find().then(result =>{
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

    // get account by Id
    @Roles(EnumRole.warehouse_manager, EnumRole.super_admin)
    @Get('/id/:ware_house_id')
    async getWareHouseByID(@Res() res, @Param('ware_house_id') ware_house_id : string) : Promise<any>{
        return this.wareHouseService.getById(ware_house_id).then(result =>{
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

    @Roles(EnumRole.warehouse_manager, EnumRole.super_admin)
    @Post('create')
    async createWareHouse(@Res() res, @Req() req,@Body()data: CreateWareHouseDTO, @Headers()token: string) : Promise<any>{
        data.user_id = req['user'].id;
        return this.wareHouseService.create(data).then(result =>{
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


    // update ware house
    @Roles(EnumRole.warehouse_manager, EnumRole.super_admin)
    @Put('update')
    async updateAccount(@Body() data : UpdateWareHouseDTO, @Res() res, @Headers()token: string): Promise<any> {
        return this.wareHouseService.update(data).then(result =>{
            res.status(200).json({
                message : 'success',
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

    // delete ware house
    @Roles(EnumRole.warehouse_manager, EnumRole.super_admin)
    @Delete('delete/:ware_house_id')
    async delete(@Res() res , @Param('ware_house_id') ware_house_id : string) : Promise<any>{
        return this.wareHouseService.delete(ware_house_id).then(result =>{
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