import {
    Column,
    DataType,
    Model,
    Table,
    ForeignKey,
    BelongsTo,
    HasMany,
    CreatedAt,
    UpdatedAt
} from 'sequelize-typescript';
import { Collection } from './collection.model';
import { JewelryMedia } from './jewelry-media.model';

@Table({ tableName: 'jewelry_sets', timestamps: true })
export class JewelrySet extends Model<JewelrySet> {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    })
    declare id: string;

    @ForeignKey(() => Collection)
    @Column(DataType.UUID)
    collection_id: string;

    @BelongsTo(() => Collection)
    collection: Collection;

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

    @Column({
        type: DataType.DECIMAL(10, 2),
        defaultValue: 0,
    })
    base_price: number;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    has_diamond: boolean;

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

    // materials column removed in favor of JewelryMedia relation

    @CreatedAt
    created_at: Date;

    @UpdatedAt
    updated_at: Date;

    @HasMany(() => JewelryMedia)
    media: JewelryMedia[];
}
