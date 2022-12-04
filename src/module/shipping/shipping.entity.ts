import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity, OneToOne,
    PrimaryGeneratedColumn,
    JoinColumn,
    UpdateDateColumn,
    OneToMany,
} from "typeorm";
import {OderEntity} from "../oder/oder.entity";
import {ShippingLogEntity} from "../shipping-log/shipping-log.entity";

@Entity({name: 'shipping'})
export class ShippingEntity extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id : string;
    
    @Column({name : 'name', type : 'varchar', nullable : true})
    name : string;

    @Column({name : 'phone', type : 'varchar', nullable : true})
    phone : string;

    @OneToOne((type)=> OderEntity, (oderEntity)=>oderEntity.shippingEntity)
    @JoinColumn({name: 'oder_id'})
    oderEntity : OderEntity;

    @OneToMany((type)=> ShippingLogEntity, (shippingLogEntity)=>shippingLogEntity.shippingEntity)
    @JoinColumn({name: 'shipping_id'})
    shippingLogEntity : ShippingLogEntity;

    @CreateDateColumn({name : 'created_at', type : 'timestamp with time zone', nullable : true})
    created_at: Date;

    @UpdateDateColumn({name : 'updated_at', type : 'timestamp with time zone', nullable : true})
    updated_at : Date;

    @DeleteDateColumn({name : 'deleted_at', type : 'timestamp with time zone', nullable : true})
    deleted_at : Date;
}