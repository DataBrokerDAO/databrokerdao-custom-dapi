import validator from 'validator';
import express from 'express';
import { DELIMITER_SENSOR } from '../config/dapi-config';

export function validateUnsubscribe(
  requestContent: string[],
  res: express.Response
) {
  if (!isValidEmail(requestContent[0])) {
    res.sendStatus(400);
  }

  if (!isValidInput(requestContent[1])) {
    res.sendStatus(400);
  }
}

function isValidEmail(email: string): Boolean {
  return validator.isEmail(email);
}

function isValidInput(sensorId: string): Boolean {
  const sensorIdParts = sensorId.split(DELIMITER_SENSOR);
  return (
    sensorId !== undefined && sensorId !== null && sensorIdParts.length == 3
  );
}
