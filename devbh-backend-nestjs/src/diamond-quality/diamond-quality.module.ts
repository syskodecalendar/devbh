import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DiamondQuality } from '../database/models/diamond-quality.model';
import { DiamondQualityController } from './diamond-quality.controller';
import { DiamondQualityService } from './diamond-quality.service';


@Module({
    imports: [SequelizeModule.forFeature([DiamondQuality])],
    controllers: [DiamondQualityController],
    providers: [DiamondQualityService],
    exports: [DiamondQualityService],
})
export class DiamondQualityModule { }
