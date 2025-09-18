const { spec } = require('pactum');
const { like } = require('pactum-matchers');

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


it('Should add a category in the list', async () => {

    await spec()
        .post('http://lojaebac.ebaconline.art.br/graphql')
        .withHeaders("Authorization", token)
        .withGraphQLQuery(`
            mutation AddCategory($name: String, $photo: String) {
                addCategory(name: $name, photo: $photo) {
                name
                photo
            }
         }      
    `)
        .withGraphQLVariables({
            "name": "Bags",
            "photo": "https://www.zipmaster.com/wp-content/uploads/2022/04/Reusable-Cloth-Shopping-Bags-Rainbow-Pack-200-Case-Reusable-Bags-B26-061-3-1000x1000.jpg.webp"
        })
        .returns('data._id')
        .expectStatus(200)
        .expectJsonMatch({
            data: {
                addCategory: {
                    name: like("Bags"),
                    photo: like("https://www.zipmaster.com/wp-content/uploads/2022/04/Reusable-Cloth-Shopping-Bags-Rainbow-Pack-200-Case-Reusable-Bags-B26-061-3-1000x1000.jpg.webp")
                }
            }
        })
});

it('Should delete a category', async () => {

    await spec()
        .post('http://lojaebac.ebaconline.art.br/graphql')
        .withHeaders("Authorization", token)
        .withGraphQLQuery(`
        mutation DeleteCategory($deleteCategoryId: ID!) {
            deleteCategory(id: $deleteCategoryId) {
            name
         }
       }        
    `)
        .withGraphQLVariables({
            "deleteCategoryId": "66f835c6995b0c7c4e35b6da"
        })
        .expectStatus(200)
        .expectJsonMatch({
            data: {
                deleteCategory: {
                    name: null 
                }
            }
        });
});

it('Should edit a category', async () => {

    await spec()
        .post('http://lojaebac.ebaconline.art.br/graphql')
        .withHeaders("Authorization", token)
        .withGraphQLQuery(`
            mutation EditCategory($editCategoryId: ID!, $name: String, $photo: String) {
                editCategory(id: $editCategoryId, name: $name, photo: $photo) {
                name
                photo
            }
        }
    `)
        .withGraphQLVariables({
            "editCategoryId": "66f5aced42524225170155b4",
            "name": `Viagens${Math.floor(Math.random() * 100)}`,
            "photo": "https://www.gstatic.com/webp/gallery/1.sm.webp"
        })
        .expectStatus(200)
        .expectJson({
            data: {
                editCategory: {
                    name: null,  
                    photo: null
                }
            }
        })
});