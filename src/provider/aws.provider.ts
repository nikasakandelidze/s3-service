import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';

const EXPIRES = 120;

@Injectable()
export class AwsService {
  private s3: S3;
  private bucketName: string;
  constructor(configService: ConfigService) {
    const AWS_SECRET_KEY = configService.get<string>('AWS_SECRET_KEY');
    const AWS_ACCESS_ID = configService.get<string>('AWS_ACCESS_ID');
    const AWS_BUCKET_REGION = configService.get<string>('AWS_BUCKET_REGION');
    this.bucketName = configService.get<string>('AWS_BUCKET_NAME');
    this.s3 = new S3({
      accessKeyId: AWS_ACCESS_ID,
      secretAccessKey: AWS_SECRET_KEY,
      region: AWS_BUCKET_REGION,
    });
  }

  async uploadBlob(title: string, fileType: string, buffer: Buffer) {
    const s3Params = {
      Bucket: this.bucketName,
      Key: `${title}.${fileType}`,
      Body: buffer,
    };
    return new Promise((resolve, reject) => {
      this.s3.upload(s3Params, (err, data) => {
        Logger.log(err, data);
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  async fileWithNameExists(fileName: string) {
    return new Promise((resolve, reject) => {
      this.s3.headObject(
        {
          Bucket: this.bucketName,
          Key: fileName,
        },
        (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        },
      );
    });
  }

  async generateMultiPartUploadUrl(title: string) {
    const s3Params = {
      Bucket: this.bucketName,
      Key: title,
      ContentType: 'multipart/form-data',
      Expires: EXPIRES,
    };
    return new Promise((resolve, reject) => {
      this.s3.getSignedUrl('putObject', s3Params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
}
// curl -X PUT -T file_to_upload -L "PRESIGNED_URL"
