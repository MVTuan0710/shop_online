import {Body, Controller, Delete, Get, Param, Post, Put, Res, UseGuards} from "@nestjs/common";
import {CategoryService} from "./category.service";
import {CreateCategoryDTO} from "./category.dto";
import {GuardsJwt} from "../auth/guard/guards.jwt";
import { RolesGuard } from "../role/guards/role.guards";
import { Roles } from '../decorator/role.decorator';
import { EnumRole } from '../constant/role/role.constant'

@Controller('category')
// @UseGuards(GuardsJwt, RolesGuard)
export class CategoryController{
    constructor(private categoryService  : CategoryService) {}

    // get all category
    @Roles(EnumRole.super_admin)
    @Get('get-all')
    async getAll(@Res() res) : Promise<any>{
        return this.categoryService.find().then(result =>{
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

    // get category by Id
    @Roles(EnumRole.super_admin)
    @Get('/id/:category_id')
    async getById(@Res() res, @Param('category_id') category_id : string) : Promise<any>{
        return this.categoryService.getById(category_id).then(result =>{
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

    //create category
    // @Roles(EnumRole.super_admin)
    @Post('create')
    async create(@Res() res, @Body()data: CreateCategoryDTO) : Promise<any>{
        return this.categoryService.create(data).then(result =>{
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


    // update category
    @Roles(EnumRole.super_admin)
    @Put('/update/:category_id')
    async putAccount(@Body() body : CreateCategoryDTO, @Res() res, @Param('')
        account_id : string ): Promise<any> {
        return this.categoryService.update(account_id, body).then(result =>{
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

    // delete category
    @Roles(EnumRole.super_admin)
    @Delete('delete/:category_id')
    async delete(@Res() res , @Param('category_id') category_id : string) : Promise<any>{
        return this.categoryService.delete(category_id).then(result =>{
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