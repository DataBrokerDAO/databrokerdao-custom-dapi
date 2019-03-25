import express from 'express';
import validator from 'validator';

export function validateUnsubscribe(
  requestContent: string[],
  res: express.Response
) {
  if (!isValidEmail(requestContent[0])) {
    res.sendStatus(400);
  }
}

function isValidEmail(email: string): boolean {
  return validator.isEmail(email);
}
