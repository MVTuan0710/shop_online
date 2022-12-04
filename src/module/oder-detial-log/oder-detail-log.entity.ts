import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    JoinColumn,
    ManyToOne, UpdateDateColumn,
} from "typeorm";
import { OderEntity } from "../oder/oder.entity";
import { ItemEntity } from "../item/item.entity";
import { OderDetailEntity } from "../oder-detail/oder-detail.entity";


@Entity({name: 'oder_detail_log'})
export class OderDetailLogEntity extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id : string;

    @Column({name : 'quantity',  type : 'integer' , nullable : true})
    quantity : number;

    @Column({name : 'total_money',  type : 'integer' , nullable : true})
    total_money : number;

    @ManyToOne((type)=>OderDetailEntity, (oderDetailEntity)=>oderDetailEntity.oderDetailLogEntity)
    @JoinColumn({name: 'oder_detail_id'})
    oderDetailEntity: OderDetailEntity;

    @CreateDateColumn({name : 'created_at', type : 'timestamp with time zone', nullable : true})
    created_at: Date;

    @UpdateDateColumn({name : 'update_at', type : 'timestamp with time zone', nullable : true})
    update_at: Date;
}