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
        filename: './access.log', // access.log打印文件位置
        maxFile: 3, // 保存最近三天的文件
    },
    errorOptions: {
        maxFile: 3, // 保存最近三天的文件
        customError: true, // 是否进行自定义错误。
        customErrorName: 'myeror', // 自定义错误的名称。默认是MyError
        customErrorFilename: './myerror.log', // 自定义错误的日志打印位置
    },
    frameworkOptions: {
        developmentName: 'dev', // 项目开发环境名。默认是 development
        productionName: 'proc', // 项目生产环境名。默认是 production
        errorFilename: './framework.error.log', // logger.error 输出信息的打印位置。默认是 ./logs/framework.error.log
        warnFilename: './framework.warn.log', // 默认是 ./logs/framework.warn.log
        infoFilename: './framework.info.log', // 默认是 ./logs/framework.info.log
        debugFilename: './framework.debug.log', // 默认是 ./logs/framework.debug.log
        datePattern: datePattern, // 日志后缀格式。默认是 .yyyy-MM-dd. e.g: access.log.2017.02.12
        localTime: true, // 是否使用本地时区
        maxFile: 3, // 保存最近三天的文件
        prepend: false,
    },
});

if (isProduction）{
    // 生产环境
    app.use(accessLog());
}

...

if (isProduction) {
    // 生产环境。errorLog必须放在错误处理函数之前。
    app.use(errorLog());
}
app.use(function (err, req, res, next) {
    // handle error
});

...

```

```
// test.js
var logger = require('express-logs-split').logger(__filename);

logger.info('this is a test');

// output: 2017-02-15 12:27:58 - info - this is a test - { filePath: '/app/test.js' }

```

```
// init config
initConfig();

// 自定义错误
var MyError = require('express-logs-split/libs/customError');

app.get('/customerror', function (req, res, next) => {
    return next(new MyError('404'));
});
```
