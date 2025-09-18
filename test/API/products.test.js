const { spec } = require('pactum');
const { faker } = require('@faker-js/faker');

let token;
beforeEach(async () => {

    token = await spec()
        .post('http://lojaebac.ebaconline.art.br/public/authUser')
        .withJson({
            "email": "admin@admin",
            "password": "admin123"
        })
        .returns('data.token')

});

it('API - Should add a product', async () => {

    const productName = faker.commerce.product()
    const productPrice = faker.commerce.price()

    await spec()
        .post('http://lojaebac.ebaconline.art.br/api/addProduct')
        .withHeaders('Authorization', token)
        .withJson({
            "name": productName,
            "price": productPrice,
            "quantity": 1
        })
        .expectStatus(200)
        .expectJson('success', true);

});

let id;
it('API - Should delete a product', async () => {

    // Pegando o id do segundo produto da lista para poder deletar
    id = await spec()
        .get('http://lojaebac.ebaconline.art.br/public/getProducts')
        .withHeaders('Authorization', token)
        .returns('products[1]._id')

    await spec()
        .delete(`http://lojaebac.ebaconline.art.br/api/deleteProduct/${id}`)
        .withHeaders('Authorization', token)
        .expectStatus(200)
        .expectJson('success', true);
});

it('API - Should edit a product', async () => {

    const productName = faker.commerce.product()
    const productPrice = faker.commerce.price()

    // Pegando o id do terceiro produto da lista para poder editar
    id = await spec()
        .get('http://lojaebac.ebaconline.art.br/public/getProducts')
        .withHeaders('Authorization', token)
        .returns('products[2]._id')

    await spec()
        .put(`http://lojaebac.ebaconline.art.br/api/editProduct/${id}`)
        .withHeaders('Authorization', token)
        .withJson({
            "name": productName,
            "price": productPrice,
            "quantity": 1000
        })
        .expectStatus(200)
        .expectJson('success', true)
});