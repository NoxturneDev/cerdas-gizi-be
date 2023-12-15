const dotenv = require('dotenv');
const app = require('./app');
dotenv.config();

const PORT = process.env.LOCAL_APP_PORT;

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});

