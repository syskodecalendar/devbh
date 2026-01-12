import { Controller, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('profiles')
@Controller('profiles')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class ProfilesController {
    constructor(private readonly profilesService: ProfilesService) { }

    @Get(':id')
    @ApiOperation({ summary: 'Get profile' })
    findOne(@Param('id') id: string) {
        return this.profilesService.findOne(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update profile' })
    update(@Param('id') id: string, @Body() body: any) {
        return this.profilesService.update(id, body);
    }
}
