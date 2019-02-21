import { DELIMITER_HASH } from '../config/dapi-config';
import { validateUnsubscribe } from './validate';
import { unsubscribe } from './registries';

export async function unsubscribeRoute(req, res) {
  const hash = new Buffer(req.query.hash, 'base64').toString('utf8');
  const requestContent = hash.split(DELIMITER_HASH);
  if (requestContent.length < 1) {
    res.sendStatus(400);
  }

  await validateUnsubscribe(requestContent, res);

  const unsubscribeUrl = DAPP


}
