const viewsRouter = require("../routes/views.routes");
const uploadRouter = require("../routes/upload.routes");
const userRouter = require("../routes/user.routes");
const productRouter = require("../routes/product.routes");
const cartRouter = require("../routes/cart.routes");
const wishlistRouter = require("../routes/whishlist.routes");
const ticketRouter = require("../routes/ticket.routes");

const setupRoutes = (app) => {
    app.use("/", viewsRouter);
    app.use("/api/v1", uploadRouter);
    app.use("/api/v1/users", userRouter);
    app.use("/api/v1/products", productRouter);
    app.use("/api/v1/carts", cartRouter);
    app.use("/api/v1/wishlist", wishlistRouter);
    app.use("/api/v1/ticket", ticketRouter);
};

module.exports = setupRoutes;
