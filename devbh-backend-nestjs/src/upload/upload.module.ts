import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        MulterModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                dest: configService.get<string>('UPLOAD_DIR'),
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [UploadController],
})
export class UploadModule { }
