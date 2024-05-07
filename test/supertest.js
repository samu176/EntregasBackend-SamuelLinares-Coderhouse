const chai = require('chai');
const supertest = require('supertest');

const expect = chai.expect;
const requester = supertest.agent("http://localhost:8080");
let cookie;

describe("Integration Tests", () => {
    describe("Test Sessions", () => {
        describe("Test register", () => {
            it("POST /register deberia registrar un usuario", async () => {
                const userMock = {
                    first_name: "prueba",
                    last_name: "detest",
                    email: "testdeprueba@example.com",
                    age: 30,
                    password: "contraseña123",
                    phoneNumber: "123456789"
                };
                const response = await requester.post("/register").send(userMock);
                expect(response.status).to.equal(302);
            });
        });

        describe("Test Login", () => {
          it("POST /login deberia loguear un usuario", async () => {
              const userCredentials = {
                  email: "testdeprueba@example.com",
                  password: "contraseña123"
              };
              const response = await requester.post("/login").send(userCredentials);
              console.log(response.body);
              expect(response.status).to.equal(302);
      
              // Obtener la cookie de la sesion y guardarla
              const cookieResult = response.headers['set-cookie'][0];
              if (typeof cookieResult === 'string') {
                  cookie = cookieResult.split(";")[0];
              }

              console.log("Cookie after login:", cookie);
          });
        });

          describe("Test User Authentication", () => {
            it("GET /sessions/current debería devolver la información del usuario autenticado", async () => {
              console.log("Cookie before test:", cookie);  
              const response = await requester
                    .get("/sessions/current")
                    .set("Cookie", cookie);

                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
                expect(response.body.user.email).to.equal("testdeprueba@example.com");
            });
        });
    });

    describe("Testing Products", () => {
      it("POST /products deberia agregar un producto", async () => {
          const productMock = {
              title: "Test Product",
              description: "This is a test product",
              code: "65123",
              price: 10045,
              status: true,
              stock: 10,
              category: "test",
              thumbnails: ["test.jpg"],
              owner: "testOwner"
          };
          const response = await requester
              .post("/products")
              .set("Cookie", cookie)
              .send(productMock);
  
          expect(response.status).to.equal(200);
          expect(response.body.title).to.equal(productMock.title);
      });
    });

  });