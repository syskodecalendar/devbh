import { Controller, Post, UseInterceptors, UploadedFile, UseGuards, Delete, Param, NotFoundException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport'; // Assumed protected
import { diskStorage } from 'multer';
import { extname } from 'path';

// Define storage manually if not using MulterModule.register dest default, strict control
const storage = diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        return cb(null, `${randomName}${extname(file.originalname)}`);
    },
});

@ApiTags('upload')
@Controller('upload')
export class UploadController {
    @Post()
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Upload file' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @UseInterceptors(FileInterceptor('file', { storage }))
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        return {
            filename: file.filename,
            path: file.path,
            mimetype: file.mimetype,
        };
    }

    @Delete(':filePath')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete a file' })
    async deleteFile(@Param('filePath') filePath: string) {
        const fs = require('fs/promises');

        try {
            await fs.access(filePath);
        } catch (e) {
            throw new NotFoundException('File not found');
        }

        await fs.unlink(filePath);
        return { message: 'File deleted successfully' };
    }
}
