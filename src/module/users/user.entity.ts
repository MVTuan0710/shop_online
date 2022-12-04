import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,OneToOne,
    PrimaryGeneratedColumn,
    JoinColumn,
    ManyToOne,
    UpdateDateColumn,
    OneToMany
} from "typeorm";
import * as bcrypt from "bcryptjs";
import {RoleEntity} from "../role/role.entity";
import { WareHouseEntity } from "../ware-house/ware-house.entity";
import {OderEntity} from "../oder/oder.entity"
import { ItemEntity } from "../item/item.entity";
import { ItemLogEntity } from "../item-log/item_log.entity";


@Entity({name: 'user'})
export class UserEntity extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    user_id : string;

    @Column({name : 'email', type : 'varchar', nullable : true})
    email : string;

    @Column({name : 'password', type : 'varchar', nullable : true})
    password : string;

    @Column({name : 'name', type : 'varchar', nullable : true})
    name : string;

    @Column({name : 'phone', type : 'varchar', nullable : true})
    phone : string;

    @Column({ default : false, name : 'is_active', nullable : true})
    is_active : boolean;

    @Column({name : 'verify_token', type : 'varchar', nullable : true})
    verify_token : string;

    @ManyToOne((type) => RoleEntity, (roleEntity)=> roleEntity.userEntity)
    @JoinColumn({name : 'role_id'})
    roleEntity : RoleEntity;

    @OneToMany((type)=> OderEntity, (oderEntity)=>oderEntity.userEntity)
    oderEntity : OderEntity[];

    @OneToMany((type)=> ItemEntity, (itemEntity)=> itemEntity.userEntity)
    itemEntity: ItemEntity[];

    @OneToMany((type)=>WareHouseEntity, (wareHouseEntity)=>wareHouseEntity.userEntity)
    wareHouseEntity : WareHouseEntity[];

    isPasswordValid(password: string): boolean {
        return bcrypt.compareSync(password, this.password)
    }

    @CreateDateColumn({name : 'created_at', type : 'timestamp with time zone', nullable : true})
    created_at: Date;

    @UpdateDateColumn({name : 'updated_at', type : 'timestamp with time zone', nullable : true})
    updated_at : Date;

    @DeleteDateColumn({name : 'deleted_at', type : 'timestamp with time zone', nullable : true})
    deleted_at : Date;
}