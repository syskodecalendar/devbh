import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { MetalKaratService } from './metal-karat.service';
import { CreateMetalKaratDto, UpdateMetalKaratDto } from './dto/metal-karat.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('metal-karats')
@Controller('metal-karats')
export class MetalKaratController {
    constructor(private readonly metalKaratService: MetalKaratService) { }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new metal karat' })
    @ApiResponse({ status: 201, description: 'The metal karat has been successfully created.' })
    create(@Body() createDto: CreateMetalKaratDto) {
        return this.metalKaratService.create(createDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all metal karats' })
    findAll() {
        return this.metalKaratService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a metal karat by id' })
    findOne(@Param('id') id: string) {
        return this.metalKaratService.findOne(id);
    }

    @Put(':id')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update a metal karat' })
    @ApiResponse({ status: 200, description: 'The metal karat has been successfully updated.' })
    update(@Param('id') id: string, @Body() updateDto: UpdateMetalKaratDto) {
        return this.metalKaratService.update(id, updateDto);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete a metal karat' })
    @ApiResponse({ status: 200, description: 'The metal karat has been successfully deleted.' })
    remove(@Param('id') id: string) {
        return this.metalKaratService.remove(id);
    }
}
