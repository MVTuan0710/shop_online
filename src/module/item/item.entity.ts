import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    UpdateDateColumn,
    JoinColumn,OneToOne,
    PrimaryGeneratedColumn,
    ManyToOne,
    OneToMany
} from "typeorm";
import { CategoryEntity } from "../categories/category.entity";
import {WareHouseEntity} from "../ware-house/ware-house.entity"
import {OderDetailEntity} from "../oder-detail/oder-detail.entity"

@Entity('item')
export class ItemEntity extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    item_id : string;

    @Column({name : 'name', type : 'varchar', nullable : true})
    name : string;

    @Column({name : 'price', type : 'numeric', nullable : true})
    price : number;

    @Column({name : 'height', type : 'numeric', nullable : true})
    height : number;

    @Column({name : 'weight', type : 'numeric', nullable : true})
    weight : number;

    @Column({name : 'usage', type : 'varchar', nullable : true})
    usage : string;

    @OneToOne((type)=> WareHouseEntity, (wareHouseEntity)=>wareHouseEntity.itemEntity)
    wareHouseEntity : WareHouseEntity;

    @ManyToOne((type)=> CategoryEntity, (categoryEntity)=>categoryEntity.itemEntity)
    @JoinColumn({name : 'category_id'})
    categoryEntity : CategoryEntity;

    @OneToMany((type)=> OderDetailEntity, (oderDetailEntity)=>oderDetailEntity.itemEntity)
    oderDetailEntity : OderDetailEntity;

    @CreateDateColumn({name : 'created_at', type : 'timestamp with time zone', nullable : true})
    created_at: Date;

    @UpdateDateColumn({name : 'updated_at', type : 'timestamp with time zone', nullable : true})
    updated_at: Date;

    @DeleteDateColumn({name : 'deleted_at', type : 'timestamp with time zone', nullable : true})
    delete_at : Date;
}