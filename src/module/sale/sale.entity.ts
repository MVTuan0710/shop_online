import {  
    CreateDateColumn, 
    UpdateDateColumn, 
    BaseEntity, 
    Column, 
    Entity, 
    OneToMany,
    PrimaryGeneratedColumn,
    DeleteDateColumn
} from 'typeorm';
import { SaleItemEntity } from '../sale-item/sale-item.entity';
import { SaleLogEntity } from '../sale-log/sale-log.entity';


@Entity({name: 'sale'})
export class SaleEntity extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    sale_id: string;

    @Column({name : 'name', type : 'varchar', nullable : true})
    name : string;

    @Column({name : 'voucher_code', type : 'varchar', nullable : true})
    voucher_code : string;

    @Column({name : 'start_date', type : 'date', nullable : true})
    start_date: Date;

    @Column({name : 'end_date', type : 'date', nullable : true})
    end_date: Date;

    @Column({name : 'value', type : 'integer', nullable : true})
    value: number;

    @OneToMany((type)=> SaleItemEntity, (saleItemEntity)=>saleItemEntity.saleEntity)
    saleItemEntity : SaleItemEntity[];
    
    @OneToMany((type)=> SaleLogEntity, (saleLogEntity)=>saleLogEntity.saleEntity)
    saleLogEntity : SaleLogEntity[];

    @CreateDateColumn({name : 'created_at', type : 'timestamp with time zone', nullable : true})
    created_at: Date;

    @UpdateDateColumn({name : 'updated_at', type : 'timestamp with time zone', nullable : true})
    updated_at : Date;

    @DeleteDateColumn({name : 'deleted_at', type : 'timestamp with time zone', nullable : true})
    deleted_at : Date;
}