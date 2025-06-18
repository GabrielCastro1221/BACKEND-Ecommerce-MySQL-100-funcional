const { Router } = require("express");
const UserManager = require("../controllers/user.controllers");

const router = Router();

router.post("/create", UserManager.createUser);
router.get("/", UserManager.getAllUsers);

router.put("/:id", UserManager.updateUser);
router.put("/:id/role", UserManager.changeRole);

router.delete("/:id", UserManager.deleteUser);

module.exports = router;