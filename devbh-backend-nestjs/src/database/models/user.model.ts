import {
    Column,
    DataType,
    Model,
    Table,
    HasOne,
    HasMany,
    CreatedAt,
    UpdatedAt
} from 'sequelize-typescript';
import { Profile } from './profile.model';
import { Session } from './session.model';

export enum UserRole {
    ADMIN = 'admin',
    MODERATOR = 'moderator',
    USER = 'user',
}

@Table({ tableName: 'users', timestamps: true })
export class User extends Model<User> {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    })
    declare id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    email: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    password_hash: string;

    @Column({
        type: DataType.ENUM(...Object.values(UserRole)),
        defaultValue: UserRole.USER,
    })
    role: UserRole;

    @CreatedAt
    created_at: Date;

    @UpdatedAt
    updated_at: Date;

    @HasOne(() => Profile)
    profile: Profile;

    @HasMany(() => Session)
    sessions: Session[];
}
