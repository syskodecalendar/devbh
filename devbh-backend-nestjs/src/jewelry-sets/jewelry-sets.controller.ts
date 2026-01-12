import { Controller, Get, Param, Post, Body, Put, UseGuards, Delete } from '@nestjs/common';
import { JewelrySetsService } from './jewelry-sets.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateJewelrySetDto, UpdateJewelrySetDto } from './dto/jewelry-sets.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('sets')
@Controller('sets')
export class JewelrySetsController {
    constructor(private readonly setsService: JewelrySetsService) { }

    @Get()
    @ApiOperation({ summary: 'Get all jewelry sets' })
    findAll() {
        return this.setsService.findAll();
    }

    @Get(':identifier')
    @ApiOperation({ summary: 'Get set details by ID or Slug' })
    findOne(@Param('identifier') identifier: string) {
        return this.setsService.findOne(identifier);
    }

    @Get(':id/media')
    @ApiOperation({ summary: 'Get media for a set' })
    findMedia(@Param('id') id: string) {
        return this.setsService.findMedia(id);
    }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new jewelry set' })
    @ApiResponse({ status: 201, description: 'The jewelry set has been successfully created.' })
    create(@Body() createJewelrySetDto: CreateJewelrySetDto) {
        return this.setsService.create(createJewelrySetDto);
    }

    @Put(':id')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update a jewelry set' })
    @ApiResponse({ status: 200, description: 'The jewelry set has been successfully updated.' })
    update(@Param('id') id: string, @Body() updateJewelrySetDto: UpdateJewelrySetDto) {
        return this.setsService.update(id, updateJewelrySetDto);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete a jewelry set' })
    @ApiResponse({ status: 200, description: 'The jewelry set has been successfully deleted.' })
    remove(@Param('id') id: string) {
        return this.setsService.remove(id);
    }
}
