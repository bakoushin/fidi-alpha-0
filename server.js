import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { Low, JSONFile } from 'lowdb';

const defaultData = {
  deals: [],
  offers: [
    {
      id: '1',
      type: 'USD',
      price: 0.99,
      amount: 10000,
      collateral: 20202.02,
      comment: 'Card2Card Transfer',
      user: {
        name: '0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0',
        rating: 4.9,
        deals: 20
      }
    },
    {
      id: '2',
      type: 'USD',
      price: 0.95,
      amount: 10,
      collateral: 21.05,
      comment: 'Western Union',
      user: {
        name: '0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b',
        rating: 4.5,
        deals: 3
      }
    },
    {
      id: '3',
      type: 'USD',
      price: 0.92,
      amount: 50000,
      collateral: 108695.65,
      comment: 'Bank Wire',
      user: {
        name: '0xE11BA2b4D45Eaed5996Cd0823791E0C93114882d',
        rating: 4.75,
        deals: '1000+'
      }
    }
  ]
};

const app = express();
app.use(express.json());
app.use(express.static('build'));
app.use(morgan('dev'));
app.use(cors());

(async () => {
  const adapter = new JSONFile('db.json');
  const db = new Low(adapter);
  await db.read();
  if (!db.data) {
    db.data = defaultData;
  }

  app.get('/api/state', async (req, res) => {
    try {
      const state = db.data;
      res.json(state);
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  });

  app.post('/api/state', async (req, res) => {
    try {
      db.data = req.body;
      await db.write();
      res.sendStatus(200);
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  });

  // 404 responder
  app.use((req, res, next) => {
    res.sendStatus(404);
  });

  // Error catcher
  app.use((err, req, res, next) => {
    res.sendStatus(500);
  });

  app.listen(8080, () => console.log(`Server is listening on port 8080`));
})().catch(console.error);
