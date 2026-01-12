import {
    Column,
    DataType,
    Model,
    Table,
    ForeignKey,
    BelongsTo,
    CreatedAt
} from 'sequelize-typescript';
import { User } from './user.model';

@Table({ tableName: 'sessions', timestamps: true, updatedAt: false })
export class Session extends Model<Session> {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    })
    declare id: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    user_id: string;

    @BelongsTo(() => User)
    user: User;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    refresh_token_hash: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    expires_at: Date;

    @CreatedAt
    created_at: Date;
}
