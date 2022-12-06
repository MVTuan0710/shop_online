import { 
    JoinColumn, 
    ManyToOne, 
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
import { UserEntity } from '../users/user.entity';

@Entity({name: 'sale'})
export class SaleEntity extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;

   @Column({name : 'name', type : 'varchar', nullable : true})
    name : string;

    @Column({
        type: 'date',
        default: () => '(CURRENT_DATE)'
    })
    start_date: Date;

    @Column({ type: 'date', nullable: true, default: () => null })
    end_date: Date;

    @Column({name : 'discount', type : 'integer', nullable : true})
    discount: number;

    @Column({ default : false, name : 'applied', nullable : true})
    applied : boolean;

    @Column({name : 'code', type : 'string', nullable : true})
    code: string;

    @OneToMany((type)=> SaleItemEntity, (saleItemEntity)=>saleItemEntity.saleEntity)
    saleItemEntity : SaleItemEntity[];

    @ManyToOne((type) => UserEntity, (userEntity) => userEntity.saleEntity)
    @JoinColumn({ name: 'created_by' })
    userEntity: UserEntity;

    @CreateDateColumn({name : 'created_at', type : 'timestamp with time zone', nullable : true})
    created_at: Date;

    @UpdateDateColumn({name : 'updated_at', type : 'timestamp with time zone', nullable : true})
    updated_at : Date;

    @DeleteDateColumn({name : 'deleted_at', type : 'timestamp with time zone', nullable : true})
    deleted_at : Date;
}