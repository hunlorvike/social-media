import { Post } from "src/entities/post.entity";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(Post)
export class PostRepository extends Repository<Post> { }