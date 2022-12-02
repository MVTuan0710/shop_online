import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    OneToMany,
    JoinColumn
} from "typeorm";
import { ItemEntity } from "../item/item.entity";
import { ItemLogEntity } from "../item-log/item_log.entity";


@Entity({name: 'category'})
export class CategoryEntity extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    category_id : string;

    @Column({name : 'name', type : 'varchar', nullable : true})
    name : string;

    @OneToMany((type)=> ItemEntity, (itemEntity)=>itemEntity.wareHouseEntity)
    itemEntity : ItemEntity;

    @OneToMany((type) => ItemLogEntity, (itemLogEntity) => itemLogEntity.categoryEntity)
    @JoinColumn({ name: 'category_id' })
    itemLogEntity: ItemLogEntity

    @CreateDateColumn({name : 'created_at', type : 'timestamp with time zone', nullable : true})
    created_at: Date;

    @UpdateDateColumn({name : 'updated_at', type : 'timestamp with time zone', nullable : true})
    updated_at : Date;

    @DeleteDateColumn({name : 'deleted_at', type : 'timestamp with time zone', nullable : true})
    deleted_at : Date;
}