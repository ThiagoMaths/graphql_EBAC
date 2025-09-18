const { reporter, flow, mock, handler } = require('pactum');
const pf = require('pactum-flow-plugin');
const { like } = require('pactum-matchers');
const { faker } = require('@faker-js/faker');

const productName = faker.commerce.product()

function addFlowReporter() {
    pf.config.url = 'http://localhost:8080';
    pf.config.projectId = 'lojaebac_front_products';
    pf.config.projectName = 'Loja Ebac Front - Products';
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
        provider: 'lojaebac_api',
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

handler.addInteractionHandler('Add product response', () => {

    return {
        provider: 'lojaebac_api',
        flow: 'Add product',
        request: {
            method: 'POST',
            path: '/api/addProduct',
            body: {
                "name": productName,
                "price": 350.00,
                "quantity": 1
            }
        },
        response: {
            status: 200,
            body: {
                "success": true,
                "message": "product added",
                "data": {
                    "categories": [],
                    "photos": [],
                    "visible": true,
                    "additionalDetails": [],
                    "_id": like("66f82f79995b0c7c4e35b65f"),
                    "name": like(productName),
                    "price": like(200),
                    "quantity": like(5),
                    "specialPrice": like(200),
                    "createdAt": like("2024-09-28T16:31:53.523Z"),
                    "updatedAt": like("2024-09-28T16:31:53.523Z"),
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

it('FRONT - Should add a product', async () => {

    await flow('Add product')
        .useInteraction('Add product response')
        .post('http://localhost:4000/api/addProduct')
        .withHeaders('Authorization', token)
        .withJson({
            "name": productName,
            "price": 350.00,
            "quantity": 1
        })
        .expectStatus(200)
        .expectJson('success', true);

});