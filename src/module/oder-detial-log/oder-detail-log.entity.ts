import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    JoinColumn,
    ManyToOne,
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

    @ManyToOne((type)=> ItemEntity, (itemEntity)=>itemEntity.oderDetailEntity)
    @JoinColumn({name : 'item_id'})
    itemEntity : ItemEntity;

    @ManyToOne((type)=> OderEntity, (oderEntity)=>oderEntity.oderEntity)
    @JoinColumn({name : 'oder_id'})
    oderEntity : OderEntity;

    @CreateDateColumn({name : 'created_at', type : 'timestamp with time zone', nullable : true})
    created_at: Date;
}