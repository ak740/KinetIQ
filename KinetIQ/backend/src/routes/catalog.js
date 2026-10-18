import { Router } from 'express';
import { query } from '../db/pool.js';
import { wrap } from '../utils.js';

const router = Router();

router.get('/catalog/subjects', wrap(async (_req, res) => {
  res.json(await query('SELECT id, slug, name, icon, description FROM subjects ORDER BY id'));
}));

export default router;
