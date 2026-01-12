import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { ValidationPipe } from '@nestjs/common';

import { Sequelize } from 'sequelize-typescript';

describe('Delete Resources (e2e)', () => {
    let app: INestApplication;
    let authTokens: { accessToken: string };
    let collectionId: string;
    let setId: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

        const sequelize = app.get(Sequelize);
        await sequelize.sync({ alter: true });

        await app.init();

        // Create user and get token
        const uniqueEmail = `test-${Date.now()}@deleteresources.com`;
        const res = await request(app.getHttpServer())
            .post('/auth/signup')
            .send({
                email: uniqueEmail,
                password: 'password123',
                fullName: 'Delete Resources Tester'
            })
            .expect(201);
        authTokens = res.body;
    });

    afterAll(async () => {
        await app.close();
    });

    describe('Collections', () => {
        it('Create collection', async () => {
            const res = await request(app.getHttpServer())
                .post('/collections')
                .set('Authorization', `Bearer ${authTokens.accessToken}`)
                .send({
                    name: 'Collection To Delete',
                    slug: 'collection-to-delete',
                    display_order: 1
                })
                .expect(201);
            collectionId = res.body.id;
        });

        it('Delete collection', async () => {
            await request(app.getHttpServer())
                .delete(`/collections/${collectionId}`)
                .set('Authorization', `Bearer ${authTokens.accessToken}`)
                .expect(200);
        });

        it('Get deleted collection should fail (or return 404/handled)', async () => {
            await request(app.getHttpServer())
                .get('/collections/collection-to-delete')
                .expect(404);
        });
    });

    describe('Jewelry Sets', () => {
        it('Create jewelry set', async () => {
            // Need a collection first
            const colRes = await request(app.getHttpServer())
                .post('/collections')
                .set('Authorization', `Bearer ${authTokens.accessToken}`)
                .send({
                    name: 'Collection For Set',
                    slug: `collection-for-set-${Date.now()}`,
                    display_order: 2
                });

            const res = await request(app.getHttpServer())
                .post('/sets')
                .set('Authorization', `Bearer ${authTokens.accessToken}`)
                .send({
                    name: 'Set To Delete',
                    collection_id: colRes.body.id,
                    slug: 'set-to-delete',
                    base_price: 1000,
                    media: [
                        {
                            type: 'image',
                            color_name: 'Gold',
                            color_code: '#FFD700',
                            url: 'https://example.com/gold-set.jpg'
                        }
                    ],
                    display_order: 1
                })
                .expect(201);
            setId = res.body.id;
        });

        it('Delete jewelry set', async () => {
            await request(app.getHttpServer())
                .delete(`/sets/${setId}`)
                .set('Authorization', `Bearer ${authTokens.accessToken}`)
                .expect(200);
        });

        it('Get deleted jewelry set should fail', async () => {
            await request(app.getHttpServer())
                .get(`/sets/${setId}`)
                .expect(404);
        });
    });
});
