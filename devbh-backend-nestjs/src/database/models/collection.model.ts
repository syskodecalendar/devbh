import {
    Column,
    DataType,
    Model,
    Table,
    HasMany,
    CreatedAt,
    UpdatedAt
} from 'sequelize-typescript';
import { JewelrySet } from './jewelry-set.model';

@Table({ tableName: 'collections', timestamps: true })
export class Collection extends Model<Collection> {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    })
    declare id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    slug: string;

    @Column(DataType.TEXT)
    short_description: string;

    @Column(DataType.TEXT)
    description: string;

    @Column(DataType.TEXT)
    cover_image: string;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    featured: boolean;

    @Column({
        type: DataType.INTEGER,
        defaultValue: 0,
    })
    display_order: number;

    @CreatedAt
    created_at: Date;

    @UpdatedAt
    updated_at: Date;

    @HasMany(() => JewelrySet)
    jewelry_sets: JewelrySet[];
}
