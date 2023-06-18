import dotenv from 'dotenv';

import app from './app';

dotenv.config();

const PORT = Number(process.env.PORT || 9003);

/**
 * Start
 */

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
