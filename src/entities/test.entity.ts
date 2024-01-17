import { Column, Entity, ManyToMany, PrimaryGeneratedColumn, JoinTable } from "typeorm";
import { User } from "./user.entity";

@Entity('test')
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'test_name', length: 255, unique: true, nullable: true })
    test: string;
}