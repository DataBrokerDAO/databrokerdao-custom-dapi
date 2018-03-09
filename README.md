# Data Custom DApi

# Info

This DApi serves a data endpoint to Gateway Providers (e.g. Proximus), whenever enlisted sensors
have new data this gets pushed and distributed to all purchasers through their method of choice.

For now all data is pushed to a Google Doc for demoing purposes.
Every purchaser gets a new entry.

## Setup

In the .env file you'll find all config variables required to set this up.
Please note that the google creds json should be added in the creds directory, with hardcoded
filename "databrokerdao-datagateway-creds.json"

```
ATLAS_CONNECTION_STRING=              [enter your connection string]
ATLAS_DATABASE_NAME=                  [enter your desired mongo database]
MIDDLEWARE_PORT=                      [can be anything]
NODE_ENV=                             [debug|production, note that cronjobs are env. dependant]
```
