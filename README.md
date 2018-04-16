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
ATLAS_CONNECTION_STRING=                   [enter your connection string]
ATLAS_DATABASE_NAME=                       [enter your desired mongo database]
MIDDLEWARE_URL=                            [url behind which this middleware is running]
MIDDLEWARE_PORT=                           [port on which this middleware is running]
MANDRILL_API_KEY                           [your mandrill api key]
MANDRILL_TEMPLATE_SLUG_SENSOR_UPDATE       [slug for the sensor update mandrill template]
MANDRILL_TEMPLATE_SLUG_SENSOR_REGISTRATION [slug for the sensor registration mandrill template]
DAPP_BASE_URL                              [url of the dapp (need it for /unsubscribed)]
NODE_ENV=                                  [debug|production]
```

