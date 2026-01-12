import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Collection } from '../database/models/collection.model';
import { CollectionsController } from './collections.controller';
import { CollectionsService } from './collections.service';

@Module({
    imports: [SequelizeModule.forFeature([Collection])],
    controllers: [CollectionsController],
    providers: [CollectionsService],
})
export class CollectionsModule { }
