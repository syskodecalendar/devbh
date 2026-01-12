import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { DiamondQualityService } from './diamond-quality.service';
import { CreateDiamondQualityDto, UpdateDiamondQualityDto } from './dto/diamond-quality.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('diamond-qualities')
@Controller('diamond-qualities')
export class DiamondQualityController {
    constructor(private readonly diamondQualityService: DiamondQualityService) { }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new diamond quality' })
    @ApiResponse({ status: 201, description: 'The diamond quality has been successfully created.' })
    create(@Body() createDto: CreateDiamondQualityDto) {
        return this.diamondQualityService.create(createDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all diamond qualities' })
    findAll() {
        return this.diamondQualityService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a diamond quality by id' })
    findOne(@Param('id') id: string) {
        return this.diamondQualityService.findOne(id);
    }

    @Put(':id')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update a diamond quality' })
    @ApiResponse({ status: 200, description: 'The diamond quality has been successfully updated.' })
    update(@Param('id') id: string, @Body() updateDto: UpdateDiamondQualityDto) {
        return this.diamondQualityService.update(id, updateDto);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete a diamond quality' })
    @ApiResponse({ status: 200, description: 'The diamond quality has been successfully deleted.' })
    remove(@Param('id') id: string) {
        return this.diamondQualityService.remove(id);
    }
}
