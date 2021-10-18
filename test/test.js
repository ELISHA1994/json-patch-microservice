import { server } from "../server.js";
import supertest from 'supertest';
const request = supertest(server);

/**
 *  Declare the token variable in a scope accessible
 *  By the entire test suite
 */
let token;

beforeAll(async () => {
    const response = await request
        .post('/api/v1/login')
        .send({
            username: 'Eli',
            password: '123',
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
    token = response.body.accessToken; // save the token!
});

afterAll((done) => {
    server.close(() => {
        done();
    });
});

describe('Get requests', () => {
    test('should return Welcome to the API', async function () {
        const res = await request
            .get('/api/v1/health')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')

        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeDefined();
        expect(res.body).toHaveProperty('message');
        // expect(res.body.message).toBe('Welcome to the json patch microservice API')
        expect(res.body.message).toMatchInlineSnapshot(`"Welcome to the json patch microservice API"`);

    });
});

describe('Post login requests', function() {
    test('should be successful with no username or password', async function () {
        const res = await request
            .post('/api/v1/login')
            .send({
                username: '',
                password: ''
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        const token = res.body.accessToken
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeDefined();
        expect(res.body.accessToken).toBeDefined();
        expect(res.body.accessToken).toEqual(token)

    });

    test('should be successful with username and a password', async function () {
        const res = await request
            .post('/api/v1/login')
            .send({
                username: 'Eli',
                password: '123'
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        const token = res.body.accessToken
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeDefined();
        expect(res.body.accessToken).toBeDefined();
        expect(res.body.accessToken).toEqual(token);
    });

    test('should be successful with a username but no password', async function () {
        const res = await request
            .post('/api/v1/login')
            .send({
                username: 'Eli',
                password: ''
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        const token = res.body.accessToken
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeDefined();
        expect(res.body.accessToken).toBeDefined();
        expect(res.body.accessToken).toEqual(token);
    });

    test('should be successful with no username but a password', async function () {
        const res = await request
            .post('/api/v1/login')
            .send({
                username: '',
                password: '123'
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        const token = res.body.accessToken
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeDefined();
        expect(res.body.accessToken).toBeDefined();
        expect(res.body.accessToken).toEqual(token);
    });
})

describe('Post jsonpatching requests', function () {
    let jsonFile = {
        "jsonObject": {
            "baz": "qux",
            "foo": "bar"
        },
        "jsonPatch" : [
            { "op": "replace", "path": "/baz", "value": "boo" },
            { "op": "add", "path": "/hello", "value": ["world"] },
            { "op": "remove", "path": "/foo" }
        ]
    };
    let result = {
        "baz": "boo",
        "hello": ["world"]
    };
    test('should be unsuccessful patch without auth', async function () {
        const res = await request
            .post('/api/v1/jsonpatch')
            .send(jsonFile)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        expect(res.status).toEqual(403);
    });
    test('should be unsuccessful patch with incorrect auth', async function () {
        const res = await request
            .post('/api/v1/jsonpatch')
            .set('Authorization', `Bearer ${token}123`)
            .send(jsonFile)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        expect(res.status).toEqual(403);
    });
    test('should be successful patch with auth', async function () {
        const res = await request
            .post('/api/v1/jsonpatch')
            .set('Authorization', `Bearer ${token}`)
            .send(jsonFile)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        expect(res.status).toEqual(200);
        expect(res.body).toBeDefined()
        expect(res.body.Patch).toBeDefined()
        expect(res.body.Patch).toEqual(result)
    });
})

describe('Post thumbnail creation requests', function () {
    const jsonFile = {
        "url" : "https://cdn.pixabay.com/photo/2017/02/24/00/13/png-2093542_960_720.png"
    };
    const jsonFile2 = {
        "url" : "https://cdn.pixabay.com/photo/2017/02/24/00/13/png-2093542_960_720.txt"
    };
    test('should be unsuccessful thumbnail creation without auth', async function () {
        const res = await request
            .post('/api/v1/image')
            .send(jsonFile)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        expect(res.status).toEqual(403);
    })
    test('should be unsuccessful thumbnail creation with incorrect auth', async function () {
        const res = await request
            .post('/api/v1/image')
            .set('Authorization', `Bearer ${token}123`)
            .send(jsonFile)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        expect(res.status).toEqual(403);
    })
    test('should be unsuccessful thumbnail creation with incorrect file format', async function () {
        const res = await request
            .post('/api/v1/image')
            .set('Authorization', `Bearer ${token}`)
            .send(jsonFile2)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        expect(res.status).toEqual(403);
        expect(res.body).toBeDefined()
        expect(res.body.message).toBeDefined()
        expect(res.body.message).toMatchInlineSnapshot(`"Invalid image extension"`)
    })
    test('should be successful thumbnail creation with auth', async function () {
        const res = await request
            .post('/api/v1/image')
            .set('Authorization', `Bearer ${token}`)
            .send(jsonFile)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        expect(res.status).toEqual(200);
        expect(res.body).toBeDefined()
        expect(res.body.message).toBeDefined()
        expect(res.body.message).toMatchInlineSnapshot(`"Successfully saved"`)
    })

})
