import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    JoinColumn,
    ManyToOne,
    UpdateDateColumn,
    OneToMany
} from "typeorm";
import { OderEntity } from "../oder/oder.entity";
import { OderDetailLogEntity } from "../oder-detial-log/oder-detail-log.entity";


@Entity({name: 'oder_detail'})
export class OderDetailEntity extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    oder_detail_id : string;

    @Column({name : 'quantity',  type : 'integer' , nullable : true})
    quantity : number;

    @Column({name : 'oder_price',  type : 'integer' , nullable : true})
    oder_price : number;

    @Column({name : 'origin_price',  type : 'integer' , nullable : true})
    origin_price : number;

    @Column({name : 'item_info',  type : 'varchar' , nullable : true})
    item_info : string;

    @Column({name : 'ware_house_id',  type : 'varchar' , nullable : true})
    ware_house_id : string;

    @Column({name : 'item_id',  type : 'varchar' , nullable : true})
    item_id : string;

    @ManyToOne((type)=> OderEntity, (oderEntity)=>oderEntity.oderDetailEntity)
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