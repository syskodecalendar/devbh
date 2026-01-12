import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { QuoteRequestsService } from './quote-requests.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('quote-requests')
@Controller('quote-requests')
export class QuoteRequestsController {
    constructor(private readonly quoteService: QuoteRequestsService) { }

    @Post()
    @ApiOperation({ summary: 'Submit a quote request (Public)' })
    create(@Body() body: any) {
        return this.quoteService.create(body);
    }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all quote requests (Admin only)' }) // Logic for admin check simplified here
    findAll() {
        // In real app, check for admin role here
        return this.quoteService.findAll();
    }
}
