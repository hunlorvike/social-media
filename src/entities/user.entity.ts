import { Column, Entity, ManyToMany, PrimaryGeneratedColumn, JoinTable, OneToMany, JoinColumn, Index } from "typeorm";
import { Role } from "./role.entity";
import { Gender } from "./gender.enum";
import { Post } from "./post.entity";

@Entity("users")
@Index("idx_email", ["email"], { unique: true })
@Index("idx_phone", ["phone"])
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'full_name', length: 255 })
    fullName: string;

    @Column({
        type: 'enum',
        enum: Gender,
        default: Gender.NOT_GIVEN,
    })
    gender: Gender;

    @Column({ length: 255, unique: true })
    email: string;

    @Column({ length: 20 })
    phone: string;

    @Column({ length: 255 })
    password: string;

    @Column({ name: 'refresh_token', length: 255 })
    refreshToken: string;

    @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @OneToMany(() => Post, post => post.author)
    posts: Post[];

    @ManyToMany(() => Role, { cascade: true })
    @JoinTable({
        name: 'users_roles',
        joinColumn: { name: 'user_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
    })
    roles: Role[];
}
