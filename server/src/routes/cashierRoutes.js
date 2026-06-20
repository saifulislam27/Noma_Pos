const express =
require("express");

const router =
express.Router();

const authMiddleware =
require("../middleware/authMiddleware");

const roleMiddleware =
require("../middleware/roleMiddleware");

const cashierController = require("../controllers/cashierController");

const {
  getCashiers,
  createCashier,
  updateCashier,
  deleteCashier,
  resetPassword,
  deactivateCashier
}
=
require("../controllers/cashierController");

router.use(
  authMiddleware
);

router.get(
  "/",
  roleMiddleware("owner"),
  getCashiers
);

router.post(
  "/",
  roleMiddleware("owner"),
  createCashier
);

router.put(
  "/:id",
  roleMiddleware("owner"),
  updateCashier
);

router.put(
  "/deactivate/:id", 
  roleMiddleware("owner"), 
  deactivateCashier // 👈 Pastikan ini sudah ter-import
);

router.patch(
  "/:id/reset-password",
  roleMiddleware("owner"),
  resetPassword
);

router.delete(
  "/:id", roleMiddleware("owner"), 
  cashierController.deleteCashier
);


module.exports =
router;