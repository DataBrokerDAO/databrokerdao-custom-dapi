import { Request, Response } from 'express';
import {
  DATABROKER_DAPP_BASE_URL,
  DELIMITER_HASH
} from '../config/dapi-config';
import { validateUnsubscribe } from './validate';

export async function unsubscribeRoute(req: Request, res: Response) {
  const hash = new Buffer(req.query.hash, 'base64').toString('utf8');

  const requestContent = hash.split(DELIMITER_HASH);
  if (requestContent.length < 1) {
    res.sendStatus(400);
  }

  await validateUnsubscribe(requestContent, res);

  try {
    const unsubscribeUrl = `${DATABROKER_DAPP_BASE_URL}/unsubscribed`;
    res.redirect(unsubscribeUrl);
  } catch (error) {
    res.send(error).status(200);
  }
}
