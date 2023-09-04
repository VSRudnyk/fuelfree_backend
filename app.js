const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const pino = require('pino-http')();
require('dotenv').config();

const app = express();
const cron = require('node-cron');

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const { getLogs } = require('./controllers/getlogs');
const authRouter = require('./routes/api/auth');
const cardsRouter = require('./routes/api/cards');

app.use(pino);

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.get('/api/logs', getLogs);

app.use('/api/auth', authRouter);
app.use('/api/cards', cardsRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const sendDailyEmail = () => {
  try {
    getLogs().then((res) => {
      console.log('Daily email sent!');
    });
  } catch (err) {
    console.error(err);
  }
};

cron.schedule('0 10 * * *', sendDailyEmail); // Запускаем расписание для отправки письма каждый день в 10:00 утра
// cron.schedule("*/10 * * * * *", sendDailyEmail); // Запускаем расписание для отправки письма каждые 10 сек

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
  req.log.info('Not found');
});

app.use((err, req, res, next) => {
  const { status = 500, message = 'Server error' } = err;
  res.status(status).json({ message });
  req.log.info('Server error');
});

module.exports = app;
