import { Injectable } from '@nestjs/common';
import { FileUploadDto } from '../web/dto/file.upload.dto';
import { AwsProvider } from './aws.provider';
import { readFile } from 'fs';

@Injectable()
export class FileService {
  private fileTypeMappings: Record<string, string> = { 'text/plain': 'txt' };
  constructor(private readonly awsProvider: AwsProvider) {}

  async uploadFile(fileDto: FileUploadDto) {
    const blob = await this.readFileAsync(fileDto.filePath);
    console.log(blob);
    const type = this.fileTypeMappings[fileDto.fileType];
    return await this.awsProvider.uploadBlob(fileDto.fileName, type, blob);
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
