import { CategoryEntity } from "../categories/category.entity"
import { ItemEntity } from "../item/item.entity"
import { UserEntity } from "../users/user.entity"

export class CreateItemLogDTO{
    name:string
    price:number
    userEntity: UserEntity
    itemEntity: ItemEntity
    categoryEntity: CategoryEntity
}