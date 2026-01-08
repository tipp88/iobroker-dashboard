import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';

const app = express();
const port = process.env.PORT || 80;
const dataDir = process.env.DATA_DIR || '/data';
const linksFile = path.join(dataDir, 'links.json');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, 'dist');

app.use(express.json({ limit: '1mb' }));

app.get('/config/links.json', async (_req, res) => {
  try {
    const data = await fs.readFile(linksFile, 'utf8');
    res.type('application/json').send(data);
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      res.json([]);
      return;
    }
    res.status(500).json({ error: 'Failed to load links' });
  }
});

app.post('/config/links.json', async (req, res) => {
  if (!Array.isArray(req.body)) {
    res.status(400).json({ error: 'Expected array of links' });
    return;
  }

  try {
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(linksFile, JSON.stringify(req.body, null, 2));
    res.json({ status: 'ok' });
  } catch {
    res.status(500).json({ error: 'Failed to save links' });
  }
});

app.use(express.static(distPath));

app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
