import { DELIMITER_HASH } from '../config/dapi-config';
import { validateUnsubscribe } from './validate';

export async function unsubscribe(req, res) {
  const hash = new Buffer(req.query.hash, 'base64').toString('utf8');
  const requestContent = hash.split(DELIMITER_HASH);
  if (requestContent.length < 1) {
    res.sendStatus(400);
  }

  validateUnsubscribe(requestContent, res);
}
