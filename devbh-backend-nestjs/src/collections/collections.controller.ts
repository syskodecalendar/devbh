import { Controller, Get, Param, Post, Body, Patch, UseGuards, Delete } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateCollectionDto, UpdateCollectionDto } from './dto/collections.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('collections')
@Controller('collections')
export class CollectionsController {
    constructor(private readonly collectionsService: CollectionsService) { }

    @Get()
    @ApiOperation({ summary: 'Get all collections' })
    findAll() {
        return this.collectionsService.findAll();
    }

    @Get(':identifier')
    @ApiOperation({ summary: 'Get collection details by slug or ID' })
    findOne(@Param('identifier') identifier: string) {
        return this.collectionsService.findOne(identifier);
    }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new collection' })
    @ApiResponse({ status: 201, description: 'The collection has been successfully created.' })
    create(@Body() createCollectionDto: CreateCollectionDto) {
        return this.collectionsService.create(createCollectionDto);
    }

    @Patch(':id')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update a collection' })
    @ApiResponse({ status: 200, description: 'The collection has been successfully updated.' })
    update(@Param('id') id: string, @Body() updateCollectionDto: UpdateCollectionDto) {
        return this.collectionsService.update(id, updateCollectionDto);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete a collection' })
    @ApiResponse({ status: 200, description: 'The collection has been successfully deleted.' })
    remove(@Param('id') id: string) {
        return this.collectionsService.remove(id);
    }
}
