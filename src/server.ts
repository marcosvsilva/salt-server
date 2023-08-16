import dotenv from 'dotenv';

import app from './app';

dotenv.config();

const PORT = Number(process.env.PORT || 9050);

/**
 * Start
 */

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
