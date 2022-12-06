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
import { ItemEntity } from '../item/item.entity';
import { SaleEntity } from '../sale/sale.entity';

@Entity({name: 'sale_item'})
export class SaleItemEntity extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({name : 'amount', type : 'integer', nullable : true})
    amount: number;

    @ManyToOne((type) => ItemEntity, (itemEntity) => itemEntity.saleItemEntity)
    @JoinColumn({ name: 'item_id' })
    itemEntity: ItemEntity;

    @ManyToOne((type) => SaleEntity, (saleEntity) => saleEntity.saleItemEntity)
    @JoinColumn({ name: 'sale_id' })
    saleEntity: SaleEntity;

    @CreateDateColumn({name : 'created_at', type : 'timestamp with time zone', nullable : true})
    created_at: Date;

    @UpdateDateColumn({name : 'updated_at', type : 'timestamp with time zone', nullable : true})
    updated_at : Date;

    @DeleteDateColumn({name : 'deleted_at', type : 'timestamp with time zone', nullable : true})
    deleted_at : Date;
}