const faker = require('faker');

function generateProducts() {
  const products = [];
  for (let i = 0; i < 100; i++) {
    products.push({
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      code: faker.random.alphaNumeric(10),
      price: faker.commerce.price(),
      status: faker.random.boolean(),
      stock: faker.random.number(),
      category: faker.commerce.department(),
      thumbnails: [faker.image.imageUrl()],
    });
  }
  return products;
}

module.exports = generateProducts;