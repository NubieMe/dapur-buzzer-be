import express from 'express';
import router from './router/index';
import { config } from './config/index';
import cors from 'cors';
import { errorHandler } from './middleware/error-handler';

const app = express();

app.use(express.static('uploads'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/api', router);
app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(config.PORT, () => {
  console.log(`Server is running on port: ${config.PORT}`);
});
