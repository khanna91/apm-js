# Introduction
This library is a wrapper around **elastic-apm-js-base** to make sure in future if we need to replace the monitoring or extend the existing one, it will be done without breaking the existing code. For full documentation you can refer to : https://www.elastic.co/guide/en/apm/agent/js-base/current/index.html

**Disclaimer**: Few of the function name and logic has been modified, hence please read below.

## Getting Started

Install the Astro APM agent for JavaScript as a dependency to your application:

```
npm install @astro-my/apm-js --save
```

Configuring the agent

```javascript
import { configure } from '@astro-my/apm-js'

configure({
  // Set custom APM Service Name (default: identity-frontend-application)
  serviceName: '',

  // Set custom APM Server URL (default: http://localhost:8200)
  serverUrl: '',

  // Set service version (required for sourcemap feature, default: 0.0.1)
  serviceVersion: ''
  
  // Whether the client is enabled or not (default value is true)
  active: boolean
})
```

### API Reference

#### Set User
```javascript
import { setUser } from '@astro-my/apm-js'

setUser(userId) // where userId is unique user identifier
```
Call this method to enrich collected performance data and errors with information about the user. 
The provided user context is stored under context.user in Elasticsearch on both errors and transactions.

#### Set Custom Context
```javascript
import { setContext } from '@astro-my/apm-js'

setContext(context)
```
Call this to enrich collected errors and transactions with any information that you think will help you debug performance issues or errors.
The provided custom context is stored under context.custom in Elasticsearch on both errors and transactions.
The given context argument must be an object and can contain any property that can be JSON encoded.

#### Set Tags
```javascript
import { setTags } from '@astro-my/apm-js'

setTags(tags)
```
Set tags on transactions and errors.
Tags are key/value pairs that are indexed by Elasticsearch and therefore searchable (as opposed to data set via setCustomContext()). You can set multiple tags.
Arguments: tags - Any key/value object with the following specifications:
- key - Any string. Must not contain periods (.) as those have special meaning in Elasticsearch
- value - Any string. If a non-string data type is given, it’s converted to a string before being sent to the APM Server.

#### Add Filter
A filter can be used to modify the APM payload before it is sent to the apm-server. This can be useful in for example redacting sensitive information from the payload:
```javascript
import { addFilter } from '@astro-my/apm-js'

addFilter(function (payload) {
  if (payload.errors) {
    payload.errors.forEach(function (error) {
      error.exception.message = error.exception.message.replace('secret', '[REDACTED]')
    })
  }
  if (payload.transactions) {
    payload.transactions.forEach(function (tr) {
      tr.spans.forEach(function (span) {
        if (span.context && span.context.http && span.context.http.url) {
          var url = new URL(span.context.http.url)
          if (url.searchParams.get('token')) {
            url.searchParams.set('token', 'REDACTED')
          }
          span.context.http.url = url.toString()
        }
      })
    })
  }
  // Make sure to return the payload
  return payload
})
```

#### Start Transaction
Starts and returns a new transaction.
```javascript
import { startTransaction } from '@astro-my/apm-js'

startTransaction(name, type)
```
Arguments:
- name - The name of the transsaction (string).
- type - The type of the transsaction (string).

#### Start Span
Starts and returns a new span on the current transaction.
```javascript
import { startSpan } from '@astro-my/apm-js'

startSpan(name, type)
```
Arguments:
- name - The name of the span (string).
- type - The type of the span (string).


#### Set Initial Page Load
```javascript
import { setInitialPageLoadName } from '@astro-my/apm-js'

setInitialPageLoadName(name)
```

Arguments:
- name - The name of the page-load transaction (string).

Use this method to set the name of the page-load transaction that is sent automatically on page load event.

#### Capture Error
```javascript
import { captureError } from '@astro-my/apm-js'

captureError(error)
```
Use this method to manually send an error to APM Server

P.S: If you need to get the raw apm object, you can import it as root, but use this if really necessary.
