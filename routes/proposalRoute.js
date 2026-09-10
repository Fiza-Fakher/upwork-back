import express from "express";
import {
  generateProposal,
  createProposal,
  getProposals,
  deleteProposal,
} from "../controllers/proposalController.js";

const router = express.Router();

router.post("/generate", generateProposal);
router.post("/proposals", createProposal);
router.get("/proposals", getProposals);
router.delete("/proposals/:id", deleteProposal);

export default router;