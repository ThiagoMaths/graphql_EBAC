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

it('API - Should add a category', async () => {

    const newCategory = faker.lorem.word(6)

    await spec()
        .post('http://lojaebac.ebaconline.art.br/api/addCategory')
        .withHeaders('Authorization', token)
        .withJson({
            "name": newCategory,
            "photo": 'https://www.zipmaster.com/wp-content/uploads/2024/04/Zippy-Tool-In-Use-1-768x768.jpg'
        })
        .expectStatus(200)
        .expectJson('success', true);

});

let id;
it('API - Should delete a category', async () => {

    // Pegando o id do segundo produto da lista para poder deletar
    id = await spec()
        .get('http://lojaebac.ebaconline.art.br/public/getCategories')
        .withHeaders('Authorization', token)
        .returns('categories[1]._id')

    await spec()
        .delete(`http://lojaebac.ebaconline.art.br/api/deleteCategory/${id}`)
        .withHeaders('Authorization', token)
        .expectStatus(200)
        .expectJson('success', true);
});

it('API - Should edit a category', async () => {

    const newCategory = faker.lorem.word()

    // Pegando o id do terceiro produto da lista para poder editar
    id = await spec()
        .get('http://lojaebac.ebaconline.art.br/public/getCategories')
        .withHeaders('Authorization', token)
        .returns('categories[2]._id')

    await spec()
        .put(`http://lojaebac.ebaconline.art.br/api/editCategory/${id}`)
        .withHeaders('Authorization', token)
        .withJson({
            "name": newCategory,
            "photo": null
        })
        .expectStatus(200)
        .expectJson('success', true)
});