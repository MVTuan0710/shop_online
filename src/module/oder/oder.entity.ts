import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    JoinColumn,
    ManyToOne,OneToOne,
    UpdateDateColumn,
    OneToMany
} from "typeorm";
import { OderDetailEntity } from "../oder-detail/oder-detail.entity";
import { UserEntity } from "../users/user.entity";


@Entity({name: 'oder'})
export class OderEntity extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    oder_id : string;

    @OneToMany((type)=> OderDetailEntity, (oderDetailEntity)=>oderDetailEntity.oderEntity)
    oderEntity : OderEntity;

    @ManyToOne((type)=> UserEntity, (userEntity)=>userEntity.oderEntity)
    @JoinColumn({name : 'user_id'})
    userEntity : UserEntity;

    @CreateDateColumn({name : 'created_at', type : 'timestamp with time zone', nullable : true})
    created_at: Date;

    @UpdateDateColumn({name : 'updated_at', type : 'timestamp with time zone', nullable : true})
    updated_at : Date;

    @DeleteDateColumn({name : 'deleted_at', type : 'timestamp with time zone', nullable : true})
    deleted_at : Date;
}