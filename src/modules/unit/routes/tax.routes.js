import express from "express";

import {
  createTax,
  getTaxes,
  getTaxById,
  updateTax,
  deleteTax,
} from "../controllers/tax.controller.js";

const router = express.Router();

// ============================================================
// TAX ROUTES
// ============================================================

// Create Tax
router.post("/", createTax);

// Get All Taxes
router.get("/", getTaxes);

// Get Tax By ID
router.get("/:id", getTaxById);

// Update Tax
router.put("/:id", updateTax);

// Delete Tax
router.delete("/:id", deleteTax);

export default router;
