import {
  Injectable,
  ServiceUnavailableException,
  Logger,
} from '@nestjs/common';
import { FileUploadDto } from '../web/dto/file.upload.dto';
import { AwsService } from './aws.provider';
import { readFile } from 'fs';
import { Repository } from 'typeorm';
import { Metadata } from 'src/repository/entity/media.metadata.entity';
import { FileUrlService } from './file.url.provider';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FileService {
  private fileTypeMappings: Record<string, string> = { 'text/plain': 'txt' };
  constructor(
    private readonly awsProvider: AwsService,
    @InjectRepository(Metadata)
    private readonly metadataRepository: Repository<Metadata>,
    private readonly fileUrlService: FileUrlService,
  ) {}

  async uploadFile(fileDto: FileUploadDto) {
    try {
      const blob = await this.readFileAsync(fileDto.filePath);
      const type = this.fileTypeMappings[fileDto.fileType];
      const metadata = new Metadata();
      metadata.fileName = fileDto.fileName;
      metadata.fileSize = blob.length;
      metadata.fullUrl = this.fileUrlService.generateFullUrlForFile(
        `${fileDto.fileName}.${type}`,
      );
      metadata.fileType = fileDto.fileType;
      const result = await this.metadataRepository.save(metadata);
      if (result) {
        const s3Result = await this.awsProvider.uploadBlob(
          fileDto.fileName,
          type,
          blob,
        );
        if (s3Result) {
          return result;
        }
      }
    } catch (e) {
      Logger.warn(e);
      throw new ServiceUnavailableException({
        message: 'Please try again later',
      });
    }
  }

  async generateUploadSignedUrl(fileDto: Partial<FileUploadDto>) {
    return {
      uploadUrl: await this.awsProvider.generateMultiPartUploadUrl(
        fileDto.fileName,
      ),
    };
  }

  private async readFileAsync(filePath: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      readFile(filePath, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
}
