import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    OneToMany
} from "typeorm";
import { UserEntity } from "../users/user.entity";
import { ItemEntity } from "../item/item.entity";


@Entity({name: 'category'})
export class CategoryEntity extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    category_id : string;

    @Column({name : 'name', type : 'varchar', nullable : true})
    name : string;

    @OneToMany((type)=> ItemEntity, (itemEntity)=>itemEntity.wareHouseEntity)
    itemEntity : ItemEntity;

    @CreateDateColumn({name : 'created_at', type : 'timestamp with time zone', nullable : true})
    created_at: Date;

    @UpdateDateColumn({name : 'updated_at', type : 'timestamp with time zone', nullable : true})
    updated_at : Date;

    @DeleteDateColumn({name : 'deleted_at', type : 'timestamp with time zone', nullable : true})
    deleted_at : Date;
}