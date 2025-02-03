import { Router } from "express";
const router = Router();
import { createCodeBin, getAllCodeBins, getCodeBinById, updateCodeBin, deleteCodeBin } from "../controllers/codeBinController";

router.post("/", createCodeBin);
router.get("/", getAllCodeBins);
router.get("/:id", getCodeBinById);
router.put("/:id", updateCodeBin);
router.delete("/:id", deleteCodeBin);

export default router;
