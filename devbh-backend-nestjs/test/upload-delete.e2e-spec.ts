import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module'; // Adjusted path
import * as fs from 'fs';
import * as path from 'path';

describe('UploadController (e2e)', () => {
    let app: INestApplication;
    let authTokens: { accessToken: string };
    let filenameToDelete: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        // Ensure uploads directory exists
        const uploadDir = path.join(process.cwd(), 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }

        // Create user and get token
        const res = await request(app.getHttpServer())
            .post('/auth/signup')
            .send({
                email: 'test@delete.com',
                password: 'password123',
                fullName: 'Delete Tester'
            });
        authTokens = res.body;

    });

    afterAll(async () => {
        await app.close();
    });

    it('Upload a file first', async () => {
        const res = await request(app.getHttpServer())
            .post('/upload')
            .set('Authorization', `Bearer ${authTokens.accessToken}`)
            .attach('file', Buffer.from('test content'), 'delete-me.txt')
            .expect(201);

        filenameToDelete = res.body.filename;
        expect(filenameToDelete).toBeDefined();

        // Verify file exists on disk
        const filePath = path.join(process.cwd(), 'uploads', filenameToDelete);
        expect(fs.existsSync(filePath)).toBe(true);
    });

    it('Delete the file (DELETE)', async () => {
        await request(app.getHttpServer())
            .delete(`/upload/${filenameToDelete}`)
            .set('Authorization', `Bearer ${authTokens.accessToken}`)
            .expect(200);

        // Verify file is gone from disk
        const filePath = path.join(process.cwd(), 'uploads', filenameToDelete);
        expect(fs.existsSync(filePath)).toBe(false);
    });

    it('Delete non-existent file', async () => {
        await request(app.getHttpServer())
            .delete('/upload/non-existent-file.txt')
            .set('Authorization', `Bearer ${authTokens.accessToken}`)
            .expect(404);
    });
});
