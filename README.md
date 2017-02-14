# express-logs-split
split logs

### How to use

```
npm install express-logs-split
```

var logsplit = require('express-logs-split');

```
// 初始化配置
logsplit.initConfig({
    accessOptions: {
        filename: './access.log', // default: ./logs/access.log,
        datePattern: options.datePattern || '.yyyy-MM-dd',
        localTime: true,
    },
    errorOptions: {

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
        prepend: options.prepend || false,
    }
});

```
