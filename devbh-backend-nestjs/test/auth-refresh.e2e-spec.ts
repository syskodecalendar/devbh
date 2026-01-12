import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AuthController (e2e)', () => {
    let app: INestApplication;
    let authTokens: { accessToken: string; refreshToken: string };

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('/auth/signup (POST) - create user for testing', () => {
        return request(app.getHttpServer())
            .post('/auth/signup')
            .send({
                email: 'test@refresh.com',
                password: 'password123',
                fullName: 'Test User'
            })
            .expect(201)
            .then(res => {
                authTokens = res.body;
                expect(authTokens.accessToken).toBeDefined();
                expect(authTokens.refreshToken).toBeDefined();
            });
    });

    it('/auth/refresh (POST) - with valid refresh token', () => {
        return request(app.getHttpServer())
            .post('/auth/refresh')
            .send({ refreshToken: authTokens.refreshToken })
            .expect(201)
            .then(res => {
                expect(res.body.accessToken).toBeDefined();
                expect(res.body.refreshToken).toBeDefined();
                // Store new tokens for next steps if needed, 
                // though usually refresh token rotation implies using the new one.
            });
    });

    it('/auth/refresh (POST) - with invalid refresh token', () => {
        return request(app.getHttpServer())
            .post('/auth/refresh')
            .send({ refreshToken: 'invalid.token.here' })
            .expect(401);
    });
});
