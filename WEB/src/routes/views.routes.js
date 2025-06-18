const { Router } = require("express");
const ViewsManager = require("../controllers/views.controllers");

const router = Router();

router.get("/auth", ViewsManager.renderIndex);
router.get("/", ViewsManager.renderHome);
router.get("/store", ViewsManager.renderStore);
router.get("/product/:id", ViewsManager.renderProductDetail);
router.get("/cart/:id", ViewsManager.renderCart);
router.get("/ticket/:id", ViewsManager.renderTicket);
router.get("/wishlist/:id", ViewsManager.renderWishlist);
router.get("/user-profile", ViewsManager.renderProfileUser);
router.get("/admin-profile", ViewsManager.renderProfileAdmin);

module.exports = router;