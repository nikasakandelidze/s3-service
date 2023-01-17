import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { AwsProvider } from './provider/aws.provider';
import { FileService } from './provider/file.provider';
import { FileController } from './web/file.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MulterModule.register({
      dest: './media',
    }),
  ],
  controllers: [FileController],
  providers: [FileService, AwsProvider],
})
export class AppModule {}
