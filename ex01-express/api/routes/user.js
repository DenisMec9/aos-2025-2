import { Router } from "express";
const router = Router();

router.get("/", async (req, res) => {
  try { res.json(await req.context.models.User.findAll()); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

router.get("/:id", async (req, res) => {
  try {
    const u = await req.context.models.User.findByPk(req.params.id);
    if (!u) return res.status(404).json({ error: "User não encontrado" });
    res.json(u);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post("/", async (req, res) => {
  try { res.status(201).json(await req.context.models.User.create(req.body)); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

router.put("/:id", async (req, res) => {
  try {
    const u = await req.context.models.User.findByPk(req.params.id);
    if (!u) return res.status(404).json({ error: "User não encontrado" });
    await u.update(req.body);
    res.json(u);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete("/:id", async (req, res) => {
  try {
    const u = await req.context.models.User.findByPk(req.params.id);
    if (!u) return res.status(404).json({ error: "User não encontrado" });
    await u.destroy();
    res.status(204).send();
  } catch (e) { res.status(500).json({ error: e.message }); }
});

export default router;
