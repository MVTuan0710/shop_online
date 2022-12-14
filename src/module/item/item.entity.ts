import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    UpdateDateColumn,
    JoinColumn,
    PrimaryGeneratedColumn,
    ManyToOne,
    OneToMany
} from "typeorm";
import { CategoryEntity } from "../categories/category.entity";
import {WareHouseEntity} from "../ware-house/ware-house.entity"
import {OderDetailEntity} from "../oder-detail/oder-detail.entity"
import { UserEntity } from "../users/user.entity";
import { ItemLogEntity } from "../item-log/item_log.entity";

@Entity('item')
export class ItemEntity extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    item_id : string;

    @Column({name : 'name', type : 'varchar', nullable : true})
    name : string;

    @Column({name : 'price', type : 'integer', nullable : true})
    price : number;

    @Column({name : 'height', type : 'integer', nullable : true})
    height : number;

    @Column({name : 'weight', type : 'integer', nullable : true})
    weight : number;

    @Column({name : 'usage', type : 'varchar', nullable : true})
    usage : string;

    @OneToMany((type)=> WareHouseEntity, (wareHouseEntity)=>wareHouseEntity.itemEntity)
    wareHouseEntity : WareHouseEntity;

    @OneToMany((type) => ItemLogEntity, (itemLogEntity) => itemLogEntity.itemEntity)
    itemLogEntity: ItemLogEntity;

    @ManyToOne((type)=> CategoryEntity, (categoryEntity)=>categoryEntity.itemEntity)
    @JoinColumn({name : 'category_id'})
    categoryEntity : CategoryEntity;

    @ManyToOne((type)=> UserEntity, (userEntity)=> userEntity.itemEntity)
    @JoinColumn({name: "user_id"})
    userEntity: UserEntity;

    @OneToMany((type)=> OderDetailEntity, (oderDetailEntity)=>oderDetailEntity.itemEntity)
    oderDetailEntity : OderDetailEntity;

    @CreateDateColumn({name : 'created_at', type : 'timestamp with time zone', nullable : true})
    created_at: Date;

    @UpdateDateColumn({name : 'updated_at', type : 'timestamp with time zone', nullable : true})
    updated_at: Date;

    @DeleteDateColumn({name : 'deleted_at', type : 'timestamp with time zone', nullable : true})
    delete_at : Date;
}