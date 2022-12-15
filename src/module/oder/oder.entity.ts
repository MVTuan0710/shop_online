import {
    BaseEntity,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    JoinColumn,
    ManyToOne,OneToOne,
    UpdateDateColumn,
    OneToMany,
    Column
} from "typeorm";
import { OderDetailEntity } from "../oder-detail/oder-detail.entity";
import { ShippingEntity } from "../shipping/shipping.entity";
import { UserEntity } from "../users/user.entity";
import { CreateOderItemDTO } from "./oder.dto";

@Entity({name: 'oder'})
export class OderEntity extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    oder_id : string;

    @Column({name : 'oder_item', type : 'jsonb', nullable : true})
    oder_item: CreateOderItemDTO[];

    @Column({name : 'voucher_code', type : 'varchar', nullable : true})
    voucher_code : string;

    @Column({name : 'discount', type : 'integer', nullable : true})
    discount : number;

    @Column({name : 'original_total_money', type : 'integer', nullable : true})
    original_total_money : number;

    @Column({name : 'total_money', type : 'integer', nullable : true})
    total_money : number;

    @OneToMany((type)=> OderDetailEntity, (oderDetailEntity)=>oderDetailEntity.oderEntity)
    oderDetailEntity: OderDetailEntity[];

    @OneToOne ((type)=> ShippingEntity, (shippingEntity)=>shippingEntity.oderEntity)
    shippingEntity: ShippingEntity;

    @ManyToOne((type)=> UserEntity, (userEntity)=>userEntity.oderEntity)
    @JoinColumn({name : 'user_id'})
    userEntity : UserEntity;

    @CreateDateColumn({name : 'created_at', type : 'timestamp with time zone', nullable : true})
    created_at: Date;

    @UpdateDateColumn({name : 'updated_at', type : 'timestamp with time zone', nullable : true})
    updated_at : Date;

    @DeleteDateColumn({name : 'deleted_at', type : 'timestamp with time zone', nullable : true})
    deleted_at : Date;
}