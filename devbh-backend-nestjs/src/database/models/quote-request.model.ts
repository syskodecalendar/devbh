import {
    Column,
    DataType,
    Model,
    Table,
    CreatedAt,
    UpdatedAt
} from 'sequelize-typescript';

@Table({ tableName: 'quote_requests', timestamps: true })
export class QuoteRequest extends Model<QuoteRequest> {
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
    customer_name: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    mobile: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    email: string;

    @Column({
        type: DataType.STRING,
        defaultValue: 'whatsapp',
    })
    preferred_contact: string;

    @Column(DataType.DATEONLY)
    occasion_date: Date;

    @Column(DataType.TEXT)
    notes: string;

    @Column(DataType.JSONB)
    selected_items: any;

    @Column({
        type: DataType.STRING,
        defaultValue: 'pending',
    })
    status: string;

    @CreatedAt
    created_at: Date;

    @UpdatedAt
    updated_at: Date;
}
