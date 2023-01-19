import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AwsService } from './provider/aws.provider';
import { FileService } from './provider/file.provider';
import { FileUrlService } from './provider/file.url.provider';
import { TypeOrmConfigService } from './repository/database.config';
import { Metadata } from './repository/entity/media.metadata.entity';
import { FileController } from './web/file.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MulterModule.register({
      dest: './media',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useClass: TypeOrmConfigService,
    }),
    TypeOrmModule.forFeature([Metadata]),
  ],
  controllers: [FileController],
  providers: [FileService, AwsService, FileUrlService],
})
export class AppModule {}
