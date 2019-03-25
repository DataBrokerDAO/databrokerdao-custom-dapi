import { isAscii, isURL } from 'validator';
import {
  Environment,
  EnvironmentVariable,
  IEnvironmentValidators
} from '../types';
import { AbstractService } from './lib/AbstractService';

export class ConfigService extends AbstractService {
  public static init(): ConfigService {
    if (!this.instance) {
      this.instance = new ConfigService();
    }
    return this.instance;
  }
  private static instance: ConfigService;

  private requiredEnvironmentVariables: IEnvironmentValidators[] = [
    { name: 'DATABROKER_DAPI_BASE_URL', validator: isURL },
    { name: 'DATABROKER_DAPI_PASSWORD', validator: isAscii },
    { name: 'DATABROKER_DAPI_USERNAME', validator: isAscii },
    { name: 'DATABROKER_DAPP_BASE_URL', validator: isURL },
    {
      name: 'MIDDLEWARE_PORT',
      validator: /^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/
    },
    { name: 'MIDDLEWARE_URL', validator: isURL },
    { name: 'MONGO_DB_NAME', validator: isAscii },
    { name: 'MONGO_DB_URL', validator: /^mongodb(\+srv)?:\/\/.*/ },
    { name: 'NODE_ENV', validator: /^(development|production)$/ },
    { name: 'SENDGRID_API_KEY', validator: /^SG\..*\..*/ },
    { name: 'SENDGRID_FROM_EMAIL', validator: isAscii },
    { name: 'SENDGRID_TEMPLATE_SLUG_DATASET_CREDENTIALS', validator: isAscii },
    { name: 'SENDGRID_TEMPLATE_SLUG_SENSOR_REGISTRATION', validator: isAscii },
    { name: 'SENDGRID_TEMPLATE_SLUG_SENSOR_UPDATE', validator: isAscii }
  ];
  private env: Environment;

  private constructor() {
    super();
    this.validateEnvironmentVariables();
  }

  public getVariable(name: EnvironmentVariable): string {
    return this.env[name];
  }

  private validateEnvironmentVariables() {
    const env = {};
    this.requiredEnvironmentVariables.forEach(item => {
      const name = item.name as EnvironmentVariable;
      const variable = process.env[name];
      const validator = item.validator;

      if (!variable) {
        throw new Error(`process.env.${name} is undefined`);
      }

      let result = false;
      if (typeof validator === 'function') {
        result = validator(variable);
      } else if (validator instanceof RegExp) {
        result = validator.test(variable);
      }
      if (!result) {
        throw new Error(`process.env.${name} has invalid value '${variable}'`);
      }

      env[name] = variable;
    });
    this.env = env as Environment;
  }
}

export default ConfigService;
