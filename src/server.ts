import app from './index';
import { PORT } from './config/env';

const port = PORT;

app.listen(port, '0.0.0.0', () => {
  console.log(`BlackRoad OS Core service listening on port ${port}`);
});
