const { reporter, flow } = require('pactum');
const pf = require('pactum-flow-plugin');
const { faker } = require('@faker-js/faker');

let token;

function addFlowReporter() {

    pf.config.url = 'http://localhost:8080';
    pf.config.projectId = 'lojaebac_api_products';
    pf.config.projectName = 'Loja Ebac Api - Products';
    pf.config.version = '1.0.0';
    pf.config.username = 'scanner';
    pf.config.password = 'scanner';
    reporter.add(pf.reporter);

}

before(async () => {

    addFlowReporter();

    token = await flow('Login')
        .post('http://lojaebac.ebaconline.art.br/public/authUser')
        .withBody({
            email: "admin@admin",
            password: "admin123"
        })
        .returns('data.token');

});


it('API - Should add a product', async () => {

    const productName = faker.commerce.product();

    await flow('Add product')
        .post('http://lojaebac.ebaconline.art.br/api/addProduct')
        .withHeaders('Authorization', token)
        .withJson({
            "name": productName,
            "price": 350.00,
            "quantity": 1
        })
        .expectStatus(200)
        .expectJson('success', true);

});