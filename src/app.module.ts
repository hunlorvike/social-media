import { RoleModule } from './modules/role.module';
import { UserModule } from './modules/user.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './modules/database.module';

@Module({
  imports: [
    DatabaseModule, // Ensure this module includes TypeOrmModule.forRoot
    RoleModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

/*
- Mọi thứ trong NestJS đều bắt đầu từ một module,
và AppModule thường là module chính của ứng dụng.

----- Nhiệm vụ -----
+ Import và sử dụng các module khác
+ Định nghĩa các providers (dịch vụ), controllers (điều khiển),...
+ Cấu hình ứng dụng


--------- Giải thích ---------------

+ imports: là một mảng chứa các module khác mà module này phụ thuộc. Khi một module A import module B, module A sẽ có thể sử dụng các providers của module B mà B đã export.
+ controllers: là một mảng chứa các controllers. Controller là nơi xử lý các request từ client.
+ providers: là một mảng chứa các services hoặc các providers khác. Providers là các lớp, giá trị hoặc hàm có thể inject vào controller, service, module,…
+ exports: là một mảng chứa các services hoặc các providers khác mà module này muốn chia sẻ với các module khác1.
*/