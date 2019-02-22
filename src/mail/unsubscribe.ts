import { DELIMITER_HASH, DAPP_BASE_URL } from '../config/dapi-config';
import { validateUnsubscribe } from './validate';
import { Response, Request } from 'express';

export async function unsubscribeRoute(req: Request, res: Response) {
  const hash = new Buffer(req.query.hash, 'base64').toString('utf8');

  const requestContent = hash.split(DELIMITER_HASH);
  if (requestContent.length < 1) {
    res.sendStatus(400);
  }

  await validateUnsubscribe(requestContent, res);

  try {
    const unsubscribeUrl = `${DAPP_BASE_URL}/unsubscribed`;
    res.redirect(unsubscribeUrl);
  } catch (error) {
    res.send(error).status(200);
  }
}
