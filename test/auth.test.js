const chai = require('chai');
const supertest = require('supertest');

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

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
          email: "john.doe@example.com",
          password: "password123"
        };
        const response = await requester.post("/login").send(userCredentials);
        expect(response.status).to.equal(302);
      });
    });
  });