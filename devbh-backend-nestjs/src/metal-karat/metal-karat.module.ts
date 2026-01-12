import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MetalKarat } from '../database/models/metal-karat.model';
import { MetalKaratController } from './metal-karat.controller';
import { MetalKaratService } from './metal-karat.service';

@Module({
    imports: [SequelizeModule.forFeature([MetalKarat])],
    controllers: [MetalKaratController],
    providers: [MetalKaratService],
    exports: [MetalKaratService],
})
export class MetalKaratModule { }
