import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QuoteRequest } from '../database/models/quote-request.model';

@Injectable()
export class QuoteRequestsService {
    constructor(
        @InjectModel(QuoteRequest)
        private quoteModel: typeof QuoteRequest,
    ) { }

    async create(data: any) {
        return this.quoteModel.create(data);
    }

    async findAll() {
        return this.quoteModel.findAll({ order: [['created_at', 'DESC']] });
    }
}
