# ![YAKjs logo](http://www.yakjs.com/asset/yakjs-logo-dark.svg)
[![GitHub version](https://img.shields.io/github/tag/cschuller/yak-js.svg?style=flat-square)](https://github.com/cschuller/yakjs)
[![npm](https://img.shields.io/npm/v/yakjs.svg?style=flat-square)](https://www.npmjs.com/package/yakjs)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://raw.githubusercontent.com/cschuller/yakjs/master/LICENSE)

A local server to stub complex WebSocket back-ends.

## Documentation

Visit [yakjs.com](http://www.yakjs.com/) for full documentation.

## Getting started

YAKjs requires [nodejs](https://nodejs.org/).

### Install via npm

```
npm install yakjs -g
```

### Start YAKjs

```
> yakjs
```

This will start YAKjs using default port `8790`.

### Open the YAKjs User Interface

Open the YAKjs user interface at [**http://localhost:8790**](http://localhost:8790)

## Versions

### 3.5.0

#### InstanceStarted event

Adds a new InstanceStarted event with access to the [express app](https://expressjs.com/en/starter/hello-world.html).
Register your routes or own middleware for an instance. 

When running an instance on port `9020` with the example plugin, then a GET request can be sent to `http://localhost:9020`
Keep in mind that an instance can use multiple plugins, use your routes accordingly to avoid conflicts.

```javascript
/**
 * @constructor
 * @struct
 * @see {!PluginWorker}
 */
function HelloWorldPlugin() {
    /**
     * @param {!InstanceStartedEvent} event
     */
    this.onInstanceStarted = event => {
        event.app.get('/', function(req, res) {
            res.send('Hello world!');
        });
    };
}

/**
 * @type {!Plugin}
 */
module.exports = {
    name: 'hello-world',
    description: 'Say hello to the world.',
    createWorker: () => new HelloWorldPlugin()
};
```

#### Removes the WSS/HTTPS experiment 
Removes the YAKjs server configuration to enable WSS/HTTPS with a (unsecure) test certificate.
