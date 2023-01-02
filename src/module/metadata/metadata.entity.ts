import {
    BaseEntity,
    Entity,
    Column,
    PrimaryGeneratedColumn
} from "typeorm";


@Entity({name: 'meta_data'})
export class MetadataEntity extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    metadata_id : string;

    @Column({name : 'meta_data', type : 'varchar', nullable : true})
    metadata : string;
}