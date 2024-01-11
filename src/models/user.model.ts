import { Gender } from "src/entities/gender.enum";
import { Role } from "src/entities/role.entity";

export class UserModel {
    id: number;
    fullName: string;
    gender: Gender;
    email: string;
    phone: string;
    password: string;
    refreshToken: string;
    createdAt: Date;
    updatedAt: Date;
    roles: Role[];

    constructor(
        id: number,
        fullName: string,
        gender: Gender,
        email: string,
        phone: string,
        password: string,
        refreshToken: string,
        createdAt: Date,
        updatedAt: Date,
        roles: Role[],
    ) {
        this.id = id;
        this.fullName = fullName;
        this.gender = gender;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.refreshToken = refreshToken;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.roles = roles;
    }
}
