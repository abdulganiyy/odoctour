import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,

} from '@aws-sdk/client-s3';

// export const AWS_S3_CONFIG = {
//     bucketName: process.env.AWS_S3_BUCKET,
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     region: process.env.AWS_REGION,
//     cloudFrontUrl: process.env.AWS_CLOUDFRONT_URL,
//   };

@Injectable()
export class S3Service {
  private s3: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3Client([{
      region: configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    }]);
  }

  async uploadFile(base64File: string, filename: string, contentType: string) {
    const buffer = Buffer.from(
      base64File.replace(/^data:image\/\w+;base64,/, ''),
      'base64',
    );
    const command = new PutObjectCommand({
      Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
      Key: filename,
      Body: buffer,
      ContentType: contentType,
    });

     await this.s3.send(command);

    return `https://${this.configService.get('AWS_S3_BUCKET_NAME')}.s3.${this.configService.get('AWS_REGION')}.amazonaws.com/${filename}`
    // console.log('response', response);
  }

  async downloadFile(filename: string) {
    const command = new GetObjectCommand({
      Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
      Key: filename,
    });

    return `https://${this.configService.get('AWS_S3_BUCKET_NAME')}.s3.${this.configService.get('AWS_REGION')}.amazonaws.com/${filename}`;

  }
}
