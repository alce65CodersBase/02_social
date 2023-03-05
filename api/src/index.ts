import http from 'http';
import { app } from './app.js';
import { dbConnect } from './db/db.connect.js';
import createDebug from 'debug';
const debug = createDebug('Social');

const PORT = process.env.PORT || 4500;

const server = http.createServer(app);

dbConnect()
  .then((mongoose) => {
    server.listen(PORT);
    debug('DB:', mongoose.connection.db.databaseName);
  })
  .catch((error) => server.emit('error', error));

server.on('error', (error) => {
  debug('Server error:', error.message);
});

server.on('listening', () => {
  const addr = server.address();
  if (addr === null) return;
  let bind: string;
  if (typeof addr === 'string') {
    bind = 'pipe ' + addr;
  } else {
    bind =
      addr.address === '::'
        ? `http://localhost:${addr?.port}`
        : `port ${addr?.port}`;
  }

  debug(`Listening on ${bind}`);
});
