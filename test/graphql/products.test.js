const { spec } = require('pactum');

let token;
beforeEach(async () => {

    token = await spec()
        .post('http://lojaebac.ebaconline.art.br/graphql')
        .withGraphQLQuery(`
            mutation AuthUser($email: String, $password: String) {
                authUser(email: $email, password: $password) {
                success
                token
            }
         }           
    `)
        .withGraphQLVariables({
            "email": "admin@admin.com",
            "password": "admin123"
        })
        .returns('data.authUser.token')

});

it('Should add a product', async () => {

    await spec()
        .post('http://lojaebac.ebaconline.art.br/graphql')
        .withHeaders('Authorization', token)
        .withGraphQLQuery(`
            mutation AddProduct($name: String, $price: Float, $quantity: Float) {
                addProduct(name: $name, price: $price, quantity: $quantity) {
                name
                price
                quantity
            }
        }     
    `)
        .withGraphQLVariables({
            "name": `Novo produto${Math.floor(Math.random() * 100)}`,
            "price": 100.00,
            "quantity": Math.floor(Math.random() * 100)
        })
        .expectStatus(200)
        .expectBodyContains("name", "price", "quantity")
});

it('Should delete a product', async () => {

    await spec()
        .post('http://lojaebac.ebaconline.art.br/graphql')
        .withHeaders('Authorization', token)
        .withGraphQLQuery(`
            mutation DeleteProduct($deleteProductId: ID!) {
                deleteProduct(id: $deleteProductId) {
                name
            }
        }
    `)
        .withGraphQLVariables({
            "deleteProductId": "66f8351f995b0c7c4e35b6ae"
        })
        .expectStatus(200)
        .expectJson({
            data: {
                deleteProduct: {
                    name: null
                }
            }
        })
});

it('Should edit a product', async () => {

    await spec()
        .post('http://lojaebac.ebaconline.art.br/graphql')
        .withHeaders('Authorization', token)
        .withGraphQLQuery(`
            mutation EditProduct($editProductId: ID!, $name: String, $price: Float, $quantity: Float) {
                editProduct(id: $editProductId, name: $name, price: $price, quantity: $quantity) {
                name
                quantity
            }
        }
    `)
        .withGraphQLVariables({
            "editProductId": "66f562b242524225170151c6",
            "name": `Guitarra${Math.floor(Math.random() * 100)}`,
            "price": 2.000,
            "quantity": 500
        })
        .expectStatus(200)
        .expectJson({
            data: {
                editProduct: {
                    name: null,
                    quantity: null
                }
            }
        })
});