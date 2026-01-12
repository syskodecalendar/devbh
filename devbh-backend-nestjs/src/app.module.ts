import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CollectionsModule } from './collections/collections.module';
import { JewelrySetsModule } from './jewelry-sets/jewelry-sets.module';
import { ProfilesModule } from './profiles/profiles.module';
import { QuoteRequestsModule } from './quote-requests/quote-requests.module';
import { UploadModule } from './upload/upload.module';
import { DiamondQualityModule } from './diamond-quality/diamond-quality.module';
import { MetalKaratModule } from './metal-karat/metal-karat.module';
import { MetalColorModule } from './metal-color/metal-color.module';
import { RedisModule } from './redis/redis.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join, resolve } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    CollectionsModule,
    JewelrySetsModule,
    ProfilesModule,
    QuoteRequestsModule,
    UploadModule,
    DiamondQualityModule,
    MetalKaratModule,
    MetalColorModule,
    RedisModule,
    ServeStaticModule.forRoot({
      rootPath: resolve('uploads'),
      serveRoot: '/uploads',
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
