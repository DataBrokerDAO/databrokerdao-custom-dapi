# Data Custom DApi

# Info

This DApi serves a data endpoint to Gateway Providers (e.g. Proximus), whenever enlisted sensors
have new data this gets pushed and distributed to all purchasers through their method of choice.

For now all data is pushed to a Google Doc for demoing purposes.
Every purchaser gets a new entry.

## Setup

In the .env file you'll find all config variables required to set this up.
Please note that the google creds json should be added in the creds directory, with hardcoded
filename "databrokerdao-datagateway-creds.json".

```
MONGO_DB_URL=                                   [enter your database connection string]
MONGO_DB_NAME=                                  [enter your desired mongo database]
MIDDLEWARE_URL=                                 [url behind which this middleware is running]
MIDDLEWARE_PORT=                                [port on which this middleware is running]
SENDGRID_API_KEY=                               [your sendgrid api key]
SENDGRID_TEMPLATE_SLUG_SENSOR_UPDATE=           [slug for the sensor update sendgrid template]
SENDGRID_TEMPLATE_SLUG_SENSOR_REGISTRATION=     [slug for the sensor registration sendgrid template]
SENDGRID_TEMPLATE_SLUG_DATASET_CREDENTIALS=     [slug for the sensor dataset credentials sendgrid template]
DATABROKER_DAPP_BASE_URL=                       [url of the dapp (need it for /unsubscribed)]
NODE_ENV=                                       [debug|production]
DAPI_USERNAME=                                  [Your dapi username from https://dapp.databrokerdao.com/]
DAPI_PASSWORD=                                  [Your dapi password from https://dapp.databrokerdao.com/]
DATABROKER_DAPI_BASE_URL=                       [databroker dapi base url, defaults to: https://dapi.databrokerdao.com/]
```
