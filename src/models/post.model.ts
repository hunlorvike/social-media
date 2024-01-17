export class PostModel {
    id: number;
    title: string;
    content: string;
    thumbnail: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(id: number, title: string, content: string, thumbnail: string, createdAt: Date, updatedAt: Date) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.thumbnail = thumbnail;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
