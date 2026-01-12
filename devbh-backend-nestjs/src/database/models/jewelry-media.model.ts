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

@Table({ tableName: 'jewelry_media', timestamps: true, updatedAt: false })
export class JewelryMedia extends Model<JewelryMedia> {
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
        validate: {
            isIn: [['image', 'video']]
        }
    })
    type: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    color_name: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    color_code: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    url: string;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    is_cover: boolean;

    @Column({
        type: DataType.INTEGER,
        defaultValue: 0,
    })
    display_order: number;

    @CreatedAt
    created_at: Date;
}
