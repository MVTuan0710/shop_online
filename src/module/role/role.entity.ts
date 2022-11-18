import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity, OneToMany,
    UpdateDateColumn,
    JoinColumn
} from "typeorm";
import {UserEntity} from "../users/user.entity"


@Entity('role')
export class RoleEntity extends BaseEntity{
    @Column({primary : true, generated : true})
    id : number;

    @Column({name : 'fullname', type : 'varchar', nullable : true})
    fullname : string;

    @CreateDateColumn({name : 'created_at', type : 'timestamp with time zone', nullable : true})
    created_at: Date;

    @UpdateDateColumn({name : 'updated_at', type : 'timestamp with time zone', nullable : true})
    updated_at: Date;

    @DeleteDateColumn({name : 'deleted_at', type : 'timestamp with time zone', nullable : true})
    delete_at : Date;

    @OneToMany((type)=> UserEntity, (userEntity)=> userEntity.roleEntity)
    @JoinColumn({name : 'role_id'})
    userEntity : UserEntity[];
}