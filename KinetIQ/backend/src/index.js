import { config } from './config.js';
import { waitForDb } from './db/pool.js';
import { migrate } from './db/migrate.js';
import { seed } from './db/seed.js';
import { createApp } from './app.js';

await waitForDb();
await migrate();
await seed();

createApp().listen(config.port, () => console.log(`[api] KinetIQ API listening on :${config.port}`));
