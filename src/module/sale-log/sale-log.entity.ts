import { 
    JoinColumn, 
    ManyToOne, 
    CreateDateColumn, 
    UpdateDateColumn, 
    BaseEntity, 
    Column, 
    Entity,
    PrimaryGeneratedColumn
} from 'typeorm';
import { SaleEntity } from '../sale/sale.entity';

@Entity({name: 'sale_log'})
export class SaleLogEntity extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    sale_log_id: string;

    @Column({name : 'name', type : 'varchar', nullable : true})
    name: string;

    @Column({name : 'voucher_code', type : 'varchar', nullable : true})
    voucher_code: string;

    @Column({name : 'value', type : 'integer', nullable : true})
    value: number;

    @Column({name : 'start_date', type : 'date', nullable : true})
    start_date: Date;

    @Column({name : 'end_date', type : 'date', nullable : true})
    end_date: Date;

    @ManyToOne((type) => SaleEntity, (saleEntity) => saleEntity.saleItemEntity)
    @JoinColumn({ name: 'sale_id' })
    saleEntity: SaleEntity;

    @CreateDateColumn({name : 'created_at', type : 'timestamp with time zone', nullable : true})
    created_at: Date;

    @UpdateDateColumn({name : 'updated_at', type : 'timestamp with time zone', nullable : true})
    updated_at : Date;
}