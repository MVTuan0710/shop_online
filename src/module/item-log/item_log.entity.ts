import { 
  BaseEntity,
  Column, 
  Entity, 
  CreateDateColumn, 
  ManyToOne, 
  JoinColumn, 
  PrimaryGeneratedColumn
} from 'typeorm'
import { ItemEntity } from '../item/item.entity'
import { CategoryEntity } from '../categories/category.entity'
import { UserEntity } from '../users/user.entity'

@Entity({ name: 'item_log' })
export class ItemLogEntity extends BaseEntity {
    [x: string]: any
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({name : 'name', type : 'varchar', nullable : true})
  name: string

  @Column({name : 'price', type : 'integer', nullable : true})
  price: number

  @ManyToOne((type) => ItemEntity, (itemEntity) => itemEntity.itemLogEntity)
  @JoinColumn({ name: 'item_id' })
  itemEntity: ItemEntity

  @ManyToOne((type) => CategoryEntity, (categoryEntity) => categoryEntity.itemLogEntity)
  @JoinColumn({ name: 'category_id' })
  categoryEntity: CategoryEntity

  @ManyToOne((type)=> UserEntity, (userEntity)=> userEntity.itemEntity)
  @JoinColumn({name: "user_id"})
  userEntity: UserEntity;

  @CreateDateColumn({name : 'created_at', type : 'timestamp with time zone', nullable : true})
  created_at: Date;
    new_itemLogEntity: any
}
