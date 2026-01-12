import {
    Column,
    DataType,
    Model,
    Table
} from 'sequelize-typescript';

@Table({ tableName: 'metal_colors', timestamps: true })
export class MetalColor extends Model<MetalColor> {
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
    })
    color_code: string;
}
