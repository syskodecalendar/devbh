import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { JewelrySet } from '../database/models/jewelry-set.model';
import { JewelryMedia } from '../database/models/jewelry-media.model';
import { JewelrySetsController } from './jewelry-sets.controller';
import { JewelrySetsService } from './jewelry-sets.service';

@Module({
    imports: [SequelizeModule.forFeature([JewelrySet, JewelryMedia])],
    controllers: [JewelrySetsController],
    providers: [JewelrySetsService],
})
export class JewelrySetsModule { }
