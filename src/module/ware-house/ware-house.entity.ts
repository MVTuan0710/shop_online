import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    JoinColumn,
    ManyToOne,
    UpdateDateColumn, OneToMany
} from "typeorm";
import { UserEntity } from "../users/user.entity";
import { ItemEntity } from "../item/item.entity";
import {WareHouseLogEntity} from "../ware-house-log/ware-house-log.entity";


@Entity({name: 'ware_house'})
export class WareHouseEntity extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    ware_house_id : string;

    @Column({name : 'quantity', type : 'integer' , nullable : true})
    quantity : number;

    @Column({name : 'expiry', type : 'timestamp with time zone', nullable : true})
    expiry : Date;

    @Column({name: 'pre_ordered_quantity', type: 'integer', nullable: true})
    pre_ordered_quantity: number;

    @Column({name: 'sold_quantity', type: 'integer', nullable: true})
    sold_quantity: number;

    @ManyToOne((type) => UserEntity, (userEntity)=> userEntity.wareHouseEntity)
    @JoinColumn({name : 'create_at'})
    userEntity : UserEntity;

    @OneToMany((type)=>WareHouseLogEntity, (wareHouseLogEntity)=>wareHouseLogEntity.wareHouseEntity)
    wareHouseLogEntity: WareHouseLogEntity;

    @ManyToOne((type)=> ItemEntity, (itemEntity)=>itemEntity.wareHouseEntity)
    @JoinColumn({name : 'item_id'})
    itemEntity : ItemEntity;

    @CreateDateColumn({name : 'created_at', type : 'timestamp with time zone', nullable : true})
    created_at: Date;

    @UpdateDateColumn({name : 'updated_at', type : 'timestamp with time zone', nullable : true})
    updated_at : Date;

    @DeleteDateColumn({name : 'deleted_at', type : 'timestamp with time zone', nullable : true})
    deleted_at : Date;
}