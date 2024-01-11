import { IsNotEmpty, IsString } from "class-validator";

export class RoleDTO {
    @IsNotEmpty({ message: 'Role name cannot be empty' })
    @IsString({ message: 'Role name must be a string' })
    roleName: string;
}