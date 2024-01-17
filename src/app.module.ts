import { PostModule } from './modules/post.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './modules/auth.module';
import { RoleModule } from './modules/role.module';
import { UserModule } from './modules/user.module';
import { TestController } from './controllers/test.controller';
import { JwtStrategy } from './configs/strategy/jwt.strategy';
import { JwtService } from '@nestjs/jwt';
import { JWT_CONFIG } from './configs/jwt.config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';

@Module({
    imports: [
        PostModule,
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                type: 'postgres',
                host: 'localhost',
                port: 5432,
                username: 'postgres',
                password: '123123123',
                database: 'nestjs_social',
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
                logging: false,
                migrations: [join(__dirname, 'migrations', '*.ts')],
                migrationsRun: true,
                synchronize: true,
            }),
            dataSourceFactory: async (options: DataSourceOptions) => {
                const dataSource = await new DataSource(options).initialize();
                return dataSource;
            },
            inject: [ConfigService],
        }),
        ConfigModule.forRoot(),
        AuthModule,
        RoleModule,
        UserModule,
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'public'), // Đường dẫn đến thư mục static
        }),

    ],
    controllers: [TestController],
    providers: [
        JwtStrategy,
        JwtService,
        {
            provide: JWT_CONFIG,
            useValue: {
                secret:
                    process.env.JWT_SECRET ||
                    'aLongSecretStringWhoseBitnessIsEqualToOrGreaterThanTheBitnessOfTheTokenEncryptionAlgorithm',
                accessTokenTtl: process.env.JWT_ACCESS_TOKEN_TTL || '3600s',
            },
        },
    ],
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
+ exports: là một mảng chứa các services hoặc các providers khác mà module này muốn chia sẻ với các module khác.
*/



/*
Trong NestJS với TypeORM, bạn có thể sử dụng các lệnh CLI của TypeORM để thực hiện các thao tác với cơ sở dữ liệu. Dưới đây là một số lệnh thường được sử dụng:

1. Tạo Migration
Lệnh: npx typeorm migration:generate -n <Tên Migration>
Mô tả: Lệnh này sẽ tạo ra một file migration mới trong thư mục migrations. Bạn nên thay thế <TênMigration> bằng tên mô tả cho migration của bạn.

2. Chạy Migration
Lệnh: npx typeorm migration:run
Mô tả: Lệnh này sẽ chạy tất cả các file migration chưa được chạy trước đó và cập nhật CSDL

3. Revert Migration 
Lệnh: npx typeorm migration:revert
Mô tả: Lệnh này sẽ rollback migration gần nhất và đưa cơ sở dữ liệu về trạng thái trước migration đó.

4. Tạo database
Lệnh: npx typeorm schema:sync
Mô tả: Lệnh này sẽ tạo hoặc cập nhật cơ sở dữ liệu dựa trên các entity đã được định nghĩa trong ứng dụng.





*/