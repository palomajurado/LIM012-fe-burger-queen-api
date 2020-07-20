const { requireAuth } = require("../middleware/auth");
const {
  getOrders,
  getOneOrder,
  createOrder,
  updateOrder,
  deleteOrder,
} = require("../controller/orders.controller");

module.exports = (app, nextMain) => {
  app.get("/orders", requireAuth, getOrders);

  app.get("/orders/:orderId", requireAuth, getOneOrder);

  app.post("/orders", requireAuth, createOrder);

  app.put("/orders/:orderId", requireAuth, updateOrder);

  app.delete("/orders/:orderId", requireAuth, deleteOrder);

  nextMain();
};
