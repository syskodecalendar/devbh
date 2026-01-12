import {
    Column,
    DataType,
    Model,
    Table,
    ForeignKey,
    BelongsTo,
    CreatedAt
} from 'sequelize-typescript';
import { JewelrySet } from './jewelry-set.model';

@Table({ tableName: 'jewelry_items', timestamps: true, updatedAt: false })
export class JewelryItem extends Model<JewelryItem> {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    })
    declare id: string;

    @ForeignKey(() => JewelrySet)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    set_id: string;

    @BelongsTo(() => JewelrySet)
    jewelry_set: JewelrySet;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    type: string;

    @Column(DataType.DECIMAL(8, 2))
    weight_grams: number;

    @Column(DataType.TEXT)
    description: string;

    @Column({
        type: DataType.INTEGER,
        defaultValue: 0,
    })
    display_order: number;

    @CreatedAt
    created_at: Date;
}
