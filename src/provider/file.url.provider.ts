import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileUrlService {
  private cdnPrefix: string;
  constructor(configService: ConfigService) {
    this.cdnPrefix = configService.get<string>('AWS_CDN_PREFIX');
  }

  generateFullUrlForFile(fileName: string) {
    return this.cdnPrefix + '/' + fileName;
  }
}
