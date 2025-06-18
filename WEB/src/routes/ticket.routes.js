const { Router } = require("express");
const TicketManager = require("../controllers/ticket.controller");

const router = Router();

router.post("/create", TicketManager.createTicket);
router.get("/", TicketManager.getAllTickets);
router.get("/:id", TicketManager.getTicketById);
router.delete("/:id", TicketManager.deleteTicket);
router.put("/:id/status", TicketManager.updateStatus);
router.put("/:id/pay", TicketManager.markAsPaid);
router.put("/:id/cancel", TicketManager.cancelTicket);
router.put("/:id/process", TicketManager.processTicket);

module.exports = router;
