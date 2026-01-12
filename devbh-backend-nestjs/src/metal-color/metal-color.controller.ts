import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { MetalColorService } from './metal-color.service';
import { CreateMetalColorDto, UpdateMetalColorDto } from './dto/metal-color.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('metal-colors')
@Controller('metal-colors')
export class MetalColorController {
    constructor(private readonly metalColorService: MetalColorService) { }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new metal color' })
    @ApiResponse({ status: 201, description: 'The metal color has been successfully created.' })
    create(@Body() createDto: CreateMetalColorDto) {
        return this.metalColorService.create(createDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all metal colors' })
    findAll() {
        return this.metalColorService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a metal color by id' })
    findOne(@Param('id') id: string) {
        return this.metalColorService.findOne(id);
    }

    @Put(':id')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update a metal color' })
    @ApiResponse({ status: 200, description: 'The metal color has been successfully updated.' })
    update(@Param('id') id: string, @Body() updateDto: UpdateMetalColorDto) {
        return this.metalColorService.update(id, updateDto);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete a metal color' })
    @ApiResponse({ status: 200, description: 'The metal color has been successfully deleted.' })
    remove(@Param('id') id: string) {
        return this.metalColorService.remove(id);
    }
}
