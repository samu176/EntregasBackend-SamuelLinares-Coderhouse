const productController = require('./productController');

async function generateTicket(cart) {
  let ticket = 'Ticket de Compra:\n\n';
  let total = 0;

  for (const product of cart.products) {
    const productInfo = await productController.getProductById(product.productId);
    const lineTotal = product.quantity * productInfo.price;
    ticket += `${productInfo.name} - Cantidad: ${product.quantity} - Precio: ${productInfo.price} - Total: ${lineTotal}\n`;
    total += lineTotal;
  }

  ticket += `\nTotal de la Compra: ${total}`;

  return ticket;
}

module.exports = { generateTicket };