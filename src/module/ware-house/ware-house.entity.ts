import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    JoinColumn,
    ManyToOne,OneToOne,
    UpdateDateColumn
} from "typeorm";
import { UserEntity } from "../users/user.entity";
import { ItemEntity } from "../item/item.entity";


@Entity({name: 'ware_house'})
export class WareHouseEntity extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    ware_house_id : string;

    @Column({name : 'quantity',  type : 'numeric' , nullable : true})
    quantity : number;

    @Column({name : 'expiry', type : 'timestamp with time zone', nullable : true})
    expiry : Date;

    @ManyToOne((type) => UserEntity, (userEntity)=> userEntity.wareHouseEntity)
    @JoinColumn({name : 'user_id'})
    userEntity : UserEntity;

    @OneToOne((type)=> ItemEntity, (itemEntity)=>itemEntity.wareHouseEntity)
    @JoinColumn({name : 'item_id'})
    itemEntity : ItemEntity;

    @CreateDateColumn({name : 'created_at', type : 'timestamp with time zone', nullable : true})
    created_at: Date;

    @UpdateDateColumn({name : 'updated_at', type : 'timestamp with time zone', nullable : true})
    updated_at : Date;

    @DeleteDateColumn({name : 'deleted_at', type : 'timestamp with time zone', nullable : true})
    deleted_at : Date;
}