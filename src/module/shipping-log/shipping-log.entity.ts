import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity, OneToOne,
    PrimaryGeneratedColumn,
    JoinColumn,
    UpdateDateColumn, ManyToOne,
} from "typeorm";
import {ShippingEntity} from "../shipping/shipping.entity";

@Entity({name: 'shipping'})
export class ShippingLogEntity extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id : string;

    @Column({name : 'name', type : 'varchar', nullable : true})
    name : string;

    @Column({name : 'phone', type : 'varchar', nullable : true})
    phone : string;

    @ManyToOne((type) => ShippingEntity, (shippingEntity) => shippingEntity.shippingLogEntity)
    @JoinColumn({name: 'shipping_id'})
    shippingEntity: ShippingEntity;

    @CreateDateColumn({name : 'created_at', type : 'timestamp with time zone', nullable : true})
    created_at: Date;

    @UpdateDateColumn({name : 'updated_at', type : 'timestamp with time zone', nullable : true})
    updated_at : Date;


}