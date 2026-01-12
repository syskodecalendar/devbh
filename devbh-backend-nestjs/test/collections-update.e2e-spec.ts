import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('CollectionsController (e2e)', () => {
    let app: INestApplication;
    let authTokens: { accessToken: string };
    let collectionId: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        // Create user and get token
        const res = await request(app.getHttpServer())
            .post('/auth/signup')
            .send({
                email: 'test@collections.com',
                password: 'password123',
                fullName: 'Collection Tester'
            });
        authTokens = res.body;
    });

    afterAll(async () => {
        await app.close();
    });

    it('Create initial collection', async () => {
        const res = await request(app.getHttpServer())
            .post('/collections')
            .set('Authorization', `Bearer ${authTokens.accessToken}`)
            .send({
                name: 'Initial Collection',
                slug: 'initial-collection',
                description: 'Initial Description',
                display_order: 1
            })
            .expect(201);

        collectionId = res.body.id;
        expect(collectionId).toBeDefined();
    });

    it('Partially update collection (PATCH)', async () => {
        const res = await request(app.getHttpServer())
            .patch(`/collections/${collectionId}`)
            .set('Authorization', `Bearer ${authTokens.accessToken}`)
            .send({
                name: 'Updated Name Only'
            })
            .expect(200);

        expect(res.body.name).toBe('Updated Name Only');
        expect(res.body.slug).toBe('initial-collection'); // Should remain unchanged
        expect(res.body.description).toBe('Initial Description'); // Should remain unchanged
    });

    it('Partially update another field', async () => {
        const res = await request(app.getHttpServer())
            .patch(`/collections/${collectionId}`)
            .set('Authorization', `Bearer ${authTokens.accessToken}`)
            .send({
                display_order: 99
            })
            .expect(200);

        expect(res.body.display_order).toBe(99);
        expect(res.body.name).toBe('Updated Name Only'); // Should remain from previous update
    });
});
