# express-logs-split
split logs

### How to use

```
npm install express-logs-split
```


```
// app.js

var { accessLog, errorLog, logger, initConfig } = require('express-logs-split');

// init config
initConfig({
    accessOptions: {
        filename: './access.log', // default: ./logs/access.log,
    },
    errorOptions: {
        customError: true, // if you want custom error
        customErrorName: 'myeror',
        customErrorFilename: './myerror.log',
    },
    frameworkOptions: {
        developmentName: 'dev', // default is development
        productionName: 'proc', // default is production
        errorFilename: './framework.error.log', // default is ./logs/framework.error.log
        warnFilename: './framework.warn.log', // default is ./logs/framework.warn.log
        infoFilename: './framework.info.log', // default is ./logs/framework.info.log
        debugFilename: './framework.debug.log', // default is ./logs/framework.debug.log
        datePattern: options.datePattern || '.yyyy-MM-dd',
        localTime: true,
        maxFile: 3,
        prepend: false,
    },
});

if (isProduction）{
    // production env
    app.use(accessLog());
}

...

if (isProduction) {
    // production env
    app.use(errorLog());
}
app.use(function (err, req, res, next) {
    // handle error
});

...

```

```
// test.js
var logger = require('express-logs-split').logger('/app/test.js');

logger.info('this is a test');

// output: 2017-02-15 12:27:58 - info - this is a test - { filePath: '/app/test.js' }

```

```
// init config
initConfig();

// custom error
var MyError = require('express-logs-split/libs/cuserr');

app.get('/customerror', function (req, res, next) => {
    return next(new MyError('404'));
});
```
