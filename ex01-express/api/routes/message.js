import { Router } from "express";
const router = Router();

router.get("/", async (req, res) => {
  try { res.json(await req.context.models.Message.findAll({ include: req.context.models.User })); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

router.get("/:id", async (req, res) => {
  try {
    const m = await req.context.models.Message.findByPk(req.params.id);
    if (!m) return res.status(404).json({ error: "Message não encontrada" });
    res.json(m);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post("/", async (req, res) => {
  try { res.status(201).json(await req.context.models.Message.create(req.body)); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

router.put("/:id", async (req, res) => {
  try {
    const m = await req.context.models.Message.findByPk(req.params.id);
    if (!m) return res.status(404).json({ error: "Message não encontrada" });
    await m.update(req.body);
    res.json(m);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete("/:id", async (req, res) => {
  try {
    const m = await req.context.models.Message.findByPk(req.params.id);
    if (!m) return res.status(404).json({ error: "Message não encontrada" });
    await m.destroy();
    res.status(204).send();
  } catch (e) { res.status(500).json({ error: e.message }); }
});

export default router;
