import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from 'src/provider/file.provider';
import { FileUploadDto } from './dto/file.upload.dto';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return await this.fileService.uploadFile({
      fileName: file.filename,
      fileType: file.mimetype,
      filePath: file.path,
    });
  }

  @Post('sync')
  async synchronizeMediaFiles() {}
}
