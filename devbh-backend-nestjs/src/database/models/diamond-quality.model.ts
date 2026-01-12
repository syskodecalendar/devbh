import {
    Column,
    DataType,
    Model,
    Table
} from 'sequelize-typescript';

@Table({ tableName: 'diamond_qualities', timestamps: false })
export class DiamondQuality extends Model<DiamondQuality> {
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
    code: string;

    @Column(DataType.TEXT)
    description: string;

    @Column({
        type: DataType.DECIMAL(4, 2),
        defaultValue: 1.00,
    })
    price_multiplier: number;

    @Column({
        type: DataType.INTEGER,
        defaultValue: 0,
    })
    display_order: number;
}
