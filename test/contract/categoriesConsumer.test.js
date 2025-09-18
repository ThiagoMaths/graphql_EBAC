const { reporter, flow, mock, handler } = require('pactum');
const pf = require('pactum-flow-plugin');
const { like } = require('pactum-matchers');
const { faker } = require('@faker-js/faker');

const newCategory = faker.lorem.word()

function addFlowReporter() {
    pf.config.url = 'http://localhost:8080';
    pf.config.projectId = 'lojaebac_front_categories';
    pf.config.projectName = 'Loja Ebac Front - Categories';
    pf.config.version = '1.0.0';
    pf.config.username = 'scanner';
    pf.config.password = 'scanner';
    reporter.add(pf.reporter);
}

before(async () => {
    addFlowReporter();
    await mock.start(4000);
});

after(async () => {
    await mock.stop();
    
});

handler.addInteractionHandler('Login response', () => {
    return {
        provider: 'lojaebac_api_categories',
        flow: 'Login',
        request: {
            method: 'POST',
            path: '/public/authUser',
            body: {
                email: "admin@admin.com",
                password: "admin123"
            }
        },
        response: {
            status: 200,
            body: {
                "success": true,
                "message": "login successfully",
                "data": {
                    "_id": "65766e71ab7a6bdbcec70d0d",
                    "role": "admin",
                    "profile": {
                        "firstName": "admin"
                    },
                    "email": "admin@admin.com",
                    "token": like("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY1NzY2ZTcxYWI3YTZiZGJjZWM3MGQwZCIsImVtYWlsIjoiYWRtaW5AYWRtaW4uY29tIiwicm9sZSI6ImFkbWluIn0sImlhdCI6MTcwNzUwMTA2MCwiZXhwIjoxNzA3NTg3NDYwfQ.Uw6rzxntfGFgWwOFEWNXaJWm_yTjg2VNY9nGAm0X0_s")
                }
            }
        }
    }
});

handler.addInteractionHandler('Add category response', () => {

    return {
        provider: 'lojaebac_api_categories',
        flow: 'Add category',
        request: {
            method: 'POST',
            path: '/api/addCategory',
            body: {
                "name": like(newCategory),
                "photo": 'https://www.zipmaster.com/wp-content/uploads/2024/04/Zippy-Tool-In-Use-1-768x768.jpg'
            }
        },
        response: {
            status: 200,
            body: {
                "success": true,
                "message": "category added",
                "data": {
                    "_id": like("66fc34a4c9760cdf2d965ee9"),
                    "name": like(newCategory),
                    "photo": like('https://www.zipmaster.com/wp-content/uploads/2024/04/Zippy-Tool-In-Use-1-768x768.jpg'),
                    "createdAt": like("2024-10-01T17:43:00.445Z"),
                    "updatedAt": like("2024-10-01T17:43:00.445Z"),
                    "__v": 0
                }
            }
        }
    }
});


beforeEach(async () => {

    token = await flow('Login')
        .useInteraction('Login response')
        .post('http://localhost:4000/public/authUser')
        .withJson({
            "email": "admin@admin.com",
            "password": "admin123"
        })
        .returns('data.token')

});

it('FRONT - Should add a category', async () => {

    await flow('Add category')
        .useInteraction('Add category response')
        .post('http://localhost:4000/api/addCategory')
        .withHeaders('Authorization', token)
        .withJson({
            "name": newCategory,
            "photo": 'https://www.zipmaster.com/wp-content/uploads/2024/04/Zippy-Tool-In-Use-1-768x768.jpg'
        })
        .expectStatus(200)
        .expectJson('success', true);

});

