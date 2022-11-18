import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,OneToOne,
    PrimaryGeneratedColumn,
    JoinColumn,
    ManyToOne,
    UpdateDateColumn
} from "typeorm";
import * as bcrypt from "bcryptjs";
import {RoleEntity} from "../role/role.entity";
// import {AccountEntity} from "../account/account.entity";
// import {ProductsEntity} from "../products/products.entity";
// import {PantryEntity} from "../pantry_management/pantry.entity";

@Entity({name: 'user'})
export class UserEntity extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    user_id : string;

    @Column({name : 'email', type : 'varchar', nullable : true})
    email : string;

    @Column({name : 'password', type : 'varchar', nullable : true})
    password : string;

    @ManyToOne((type) => RoleEntity, (roleEntity)=> roleEntity.userEntity)
    @JoinColumn({name : 'role_id'})
    roleEntity : RoleEntity;

    @Column({name : 'name', type : 'varchar', nullable : true})
    name : string;

    @Column({name : 'phone', type : 'varchar', nullable : true})
    phone : string;

    @Column({ default : false, name : 'is_active', nullable : true})
    is_active : boolean;

    @Column({name : 'verify_token', type : 'varchar', nullable : true})
    verify_token : string;

    // @ManyToOne((type) => RoleEntity, (role)=> role.account)
    // @JoinColumn({name : 'role_id'})
    // role : RoleEntity;

    // @OneToOne(() => AccountEntity,(accountEntity) => accountEntity.account_id )// chỉ định mặt nghịch đảo làm tham số thứ hai
    // @JoinColumn()
    // accountEntity: AccountEntity

    @CreateDateColumn({name : 'created_at', type : 'timestamp with time zone', nullable : true})
    created_at: Date;

    @UpdateDateColumn({name : 'updated_at', type : 'timestamp with time zone', nullable : true})
    updated_at : Date;

    @DeleteDateColumn({name : 'deleted_at', type : 'timestamp with time zone', nullable : true})
    deleted_at : Date;

    isPasswordValid(password: string): boolean {
        return bcrypt.compareSync(password, this.password)
    }
}