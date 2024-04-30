const chai = require('chai');
const supertest = require('supertest');
const expect = chai.expect;
const requester = supertest.agent("http://localhost:8080");

describe("Testing Products", () => {
    let cookie;

    before(async () => {
        const user = { 
            email: 'pruebasupertest@gmail.com', 
            password: 'contraseñatest', 
            first_name: 'Test', 
            last_name: 'User', 
            phoneNumber: '1234567890', 
            age: 30
        };
        await requester.post('/register').send(user); 
        const res = await requester.post('/login').send(user); 
        cookie = res.headers['set-cookie'].join(';');
    });

    it("POST /products deberia agregar un producto", async () => {
        const productMock = {
            title: "Producto de prueba",
            description: "Este es un producto de prueba",
            code: "65123",
            price: 10045,
            status: true,
            stock: 10,
            category: "prueba",
            thumbnails: ["test.jpg"],
            owner: "testOwner"
        };
        const response = await requester
            .post("/products")
            .set('Cookie', cookie)
            .send(productMock);
        expect(response.status).to.equal(200);
        expect(response.body.title).to.equal(productMock.title);
    });
});