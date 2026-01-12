import {
    Column,
    DataType,
    Model,
    Table,
    ForeignKey,
    BelongsTo,
    CreatedAt,
    UpdatedAt
} from 'sequelize-typescript';
import { User } from './user.model';

@Table({ tableName: 'profiles', timestamps: true })
export class Profile extends Model<Profile> {
    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        primaryKey: true,
    })
    declare id: string;

    @BelongsTo(() => User)
    user: User;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    email: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    full_name: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    avatar_url: string;

    @CreatedAt
    created_at: Date;

    @UpdatedAt
    updated_at: Date;
}
