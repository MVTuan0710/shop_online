import {Body, Controller, Delete, Get, Headers, Param, Post, Req, Res, UseGuards} from "@nestjs/common";
import {ShippingService} from "./shipping.service";
import {CreateShippingDTO} from "./shipping.dto"
import dataSource from "ormconfig";



@Controller('shipping')
export class ShippingController{
    constructor(private shippingService : ShippingService) {}

    // get all
    @Get('get-all')
    async getAll(@Res() res){
        return this.shippingService.getAll().then(result =>{
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
    @Post('create')
    async create(@Res() res, @Body() data: CreateShippingDTO,@Req()req){
        data.user_id = req['user'].id;
        return this.shippingService.create(data).then(result =>{
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
    // //delete 
    // @Delete('delete/:oder_id')
    // async delete(@Res() res, @Param('oder_id')oder_id:string){
    //     return this.oderService.delete(oder_id).then(result =>{
    //         res.status(200).json({
    //             message : 'success',
    //             result,
    //         });
    //     }).catch(err =>{
    //         res.status(500).json({
    //             message : 'failed',
    //             err,
    //         });
    //     })
    // }
    // // update 
    // @Get('update/:ship_id')
    // async getByOderId(@Res() res, @Body, @Param('ship_id') ship_id : string){
    //     return this.oderService.getByOderId(ship_id).then(result =>{
    //         res.status(200).json({
    //             message : 'success',
    //             result,
    //         });
    //     }).catch(err =>{
    //         res.status(500).json({
    //             message : 'failed',
    //             err,
    //         });
    //     })
    // }
}