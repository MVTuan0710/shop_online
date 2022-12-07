import { 
    JoinColumn, 
    ManyToOne, 
    CreateDateColumn, 
    UpdateDateColumn, 
    BaseEntity, 
    Column, 
    Entity,
    PrimaryGeneratedColumn,
    DeleteDateColumn
} from 'typeorm';
import { SaleEntity } from '../sale/sale.entity';

@Entity({name: 'sale_item'})
export class SaleLogEntity extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({name : 'name', type : 'string', nullable : true})
    name: string;

    @Column({name : 'amoubt', type : 'string', nullable : true})
    amount: string;

    @Column({name : 'discount', type : 'integer', nullable : true})
    discount: number;

    @Column({name : 'start_date', type : 'timestamp with time zone', nullable : true})
    start_date : Date;

    @Column({ name : 'start_date', type : 'timestamp with time zone', default: null })
    end_date: Date

    @Column({name : 'code', type : 'string', nullable : true})
    code: string;

    @Column({ default : false, name : 'applied'})
    applied : boolean;



    @ManyToOne((type) => SaleEntity, (saleEntity) => saleEntity.saleItemEntity)
    @JoinColumn({ name: 'sale_id' })
    saleEntity: SaleEntity;

    @CreateDateColumn({name : 'created_at', type : 'timestamp with time zone', nullable : true})
    created_at: Date;

    @UpdateDateColumn({name : 'updated_at', type : 'timestamp with time zone', nullable : true})
    updated_at : Date;
}