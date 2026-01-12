import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { QuoteRequest } from '../database/models/quote-request.model';
import { QuoteRequestsController } from './quote-requests.controller';
import { QuoteRequestsService } from './quote-requests.service';

@Module({
    imports: [SequelizeModule.forFeature([QuoteRequest])],
    controllers: [QuoteRequestsController],
    providers: [QuoteRequestsService],
})
export class QuoteRequestsModule { }
