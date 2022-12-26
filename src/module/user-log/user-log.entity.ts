import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    JoinColumn,
    ManyToOne, 
    UpdateDateColumn,
} from "typeorm";
import { UserEntity } from "../users/user.entity";


@Entity({name: 'user_log'})
export class UserLogEntity extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id : string;

    @Column({name : 'email', type : 'varchar', nullable : true})
    email : string;

    @Column({name : 'name', type : 'varchar', nullable : true})
    name : string;

    @Column({name : 'address', type : 'varchar', nullable : true})
    address : string;

    @Column({name : 'phone', type : 'varchar', nullable : true})
    phone : string;

    @ManyToOne((type)=>UserEntity, (userEntity)=>userEntity.userLogEntity)
    @JoinColumn({name: 'user_id'})
    userEntity: UserEntity;

    @CreateDateColumn({name : 'created_at', type : 'timestamp with time zone', nullable : true})
    created_at: Date;

    @UpdateDateColumn({name : 'update_at', type : 'timestamp with time zone', nullable : true})
    update_at: Date;
}