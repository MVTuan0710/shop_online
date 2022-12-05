import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    JoinColumn,
    ManyToOne,OneToOne,
    UpdateDateColumn,
    OneToMany
} from "typeorm";
import { OderEntity } from "../oder/oder.entity";
import { ItemEntity } from "../item/item.entity";
import { OderDetailLogEntity } from "../oder-detial-log/oder-detail-log.entity";


@Entity({name: 'oder_detail'})
export class OderDetailEntity extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    oder_detail_id : string;

    @Column({name : 'quantity',  type : 'integer' , nullable : true})
    quantity : number;

    @Column({name : 'total_money',  type : 'integer' , nullable : true})
    total_money : number;

    @ManyToOne((type)=> ItemEntity, (itemEntity)=>itemEntity.oderDetailEntity)
    @JoinColumn({name : 'item_id'})
    itemEntity : ItemEntity;

    @ManyToOne((type)=> OderEntity, (oderEntity)=>oderEntity.oderEntity)
    @JoinColumn({name : 'oder_id'})
    oderEntity : OderEntity;

    @OneToMany((type)=>OderDetailLogEntity, (oderDetailLogEntity)=>oderDetailLogEntity.oderDetailEntity)
    oderDetailLogEntity: OderDetailLogEntity[];

    @CreateDateColumn({name : 'created_at', type : 'timestamp with time zone', nullable : true})
    created_at: Date;

    @UpdateDateColumn({name : 'updated_at', type : 'timestamp with time zone', nullable : true})
    updated_at : Date;

    @DeleteDateColumn({name : 'deleted_at', type : 'timestamp with time zone', nullable : true})
    deleted_at : Date;
}