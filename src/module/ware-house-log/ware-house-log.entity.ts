import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    JoinColumn,
    ManyToOne,
    UpdateDateColumn
} from "typeorm";

import {WareHouseEntity} from "../ware-house/ware-house.entity";
import {UserEntity} from "../users/user.entity";


@Entity({name: 'ware_house_log'})
export class WareHouseLogEntity extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id : string;

    @Column({name : 'quantity',  type : 'integer' , nullable : true})
    quantity : number;

    @Column({name : 'expiry', type : 'timestamp with time zone', nullable : true})
    expiry : Date;

    @ManyToOne((type) => WareHouseEntity, (wareHouseEntity)=> wareHouseEntity.wareHouseLogEntity)
    @JoinColumn({name : 'ware_house_id'})
    wareHouseEntity : WareHouseEntity;

    @CreateDateColumn({name : 'created_at', type : 'timestamp with time zone', nullable : true})
    created_at: Date;

    @UpdateDateColumn({name : 'updated_at', type : 'timestamp with time zone', nullable : true})
    updated_at : Date;

}