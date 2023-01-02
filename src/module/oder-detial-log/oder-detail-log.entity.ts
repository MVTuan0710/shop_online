import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    JoinColumn,
    ManyToOne, UpdateDateColumn,
} from "typeorm";
import { OderDetailEntity } from "../oder-detail/oder-detail.entity";


@Entity({name: 'oder_detail_log'})
export class OderDetailLogEntity extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id : string;

    @Column({name : 'item_info',  type : 'varchar' , nullable : true})
    item_info : string;

    @Column({name : 'quantity',  type : 'integer' , nullable : true})
    quantity : number;

    @Column({name : 'oder_price',  type : 'integer' , nullable : true})
    oder_price : number;

    @Column({name : 'origin_price',  type : 'integer' , nullable : true})
    origin_price : number;
    
    @ManyToOne((type)=>OderDetailEntity, (oderDetailEntity)=>oderDetailEntity.oderDetailLogEntity)
    @JoinColumn({name: 'oder_detail_id'})
    oderDetailEntity: OderDetailEntity;

    @CreateDateColumn({name : 'created_at', type : 'timestamp with time zone', nullable : true})
    created_at: Date;

    @UpdateDateColumn({name : 'update_at', type : 'timestamp with time zone', nullable : true})
    update_at: Date;
}