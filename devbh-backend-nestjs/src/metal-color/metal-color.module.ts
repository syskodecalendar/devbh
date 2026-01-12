import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MetalColor } from '../database/models/metal-color.model';
import { MetalColorController } from './metal-color.controller';
import { MetalColorService } from './metal-color.service';

@Module({
    imports: [SequelizeModule.forFeature([MetalColor])],
    controllers: [MetalColorController],
    providers: [MetalColorService],
    exports: [MetalColorService],
})
export class MetalColorModule { }
