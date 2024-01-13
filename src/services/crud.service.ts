import { BaseResponse } from "src/response/base.response";

// crud.interface.ts
export interface CrudService<Entity, Model, DTO, Response = BaseResponse<Model | Model[] | boolean | number>> {
    create(data: DTO): Promise<Response>;
    findAll(): Promise<Response>;
    findOne(id: number): Promise<Response>;
    update(id: number, data: DTO): Promise<Response>;
    remove(id: number): Promise<Response>;

    find(criteria: Record<string, any>): Promise<Response>;
    count(criteria: Record<string, any>): Promise<Response>;

    entityToModel(entity: Entity): Promise<Model>;
    dtoToEntity(dto: DTO): Promise<Entity>;
}
