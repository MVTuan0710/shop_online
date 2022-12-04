import {
  BaseEntity,
  Column,
  Entity,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm'
import { ItemEntity } from '../item/item.entity'
import { CategoryEntity } from '../categories/category.entity'
import { UserEntity } from '../users/user.entity'

@Entity({ name: 'item_log' })
export class ItemLogEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({name : 'price', type : 'integer', nullable : true})
  price : number;

  @Column({name : 'height', type : 'integer', nullable : true})
  height : number;

  @Column({name : 'weight', type : 'integer', nullable : true})
  weight : number;

  @Column({name : 'usage', type : 'varchar', nullable : true})
  usage : string;

  @Column({name : 'name', type : 'varchar', nullable : true})
  name: string

  @ManyToOne((type) => ItemEntity, (itemEntity) => itemEntity.itemLogEntity)
  @JoinColumn({ name: 'item_id' })
  itemEntity: ItemEntity

  @CreateDateColumn({name : 'created_at', type : 'timestamp with time zone', nullable : true})
  created_at: Date;

  @UpdateDateColumn({name : 'update_at', type : 'timestamp with time zone', nullable : true})
  update_at: Date;
}
