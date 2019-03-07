import { Request, Response } from 'express';
import validator = require('validator');
import {
  DATABROKER_DAPP_BASE_URL,
  DELIMITER_HASH
} from '../config/dapi-config';
import { unsubscribe } from './registries';

export async function unsubscribeRoute(req: Request, res: Response) {
  console.log('Unsubscribe called!');
  const hash = Buffer.from(req.query.hash, 'base64').toString('utf8');
  const parts = hash.split(DELIMITER_HASH);
  console.log(parts, hash);
  if (parts.length < 1) {
    res.sendStatus(400);
  }

  // Validate user input - email
  const email = parts[0];
  const sensorid = parts[1];
  if (!validator.isEmail(email)) {
    res.sendStatus(400);
  }
  try {
    console.log(email, sensorid);
    await unsubscribe(email, sensorid);
    const unsubscribedUrl = `${DATABROKER_DAPP_BASE_URL}/unsubscribed`;
    // res.redirect(unsubscribedUrl);
  } catch (error) {
    res.send(error).status(200);
  }
}
