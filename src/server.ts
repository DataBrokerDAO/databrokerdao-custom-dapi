import express from 'express';
import bodyParser = require('body-parser');
import { unsubscribe } from './mail/unsubscribe';

const app = express();

app.use(bodyParser);

app.get('/debug', unsubscribe);
