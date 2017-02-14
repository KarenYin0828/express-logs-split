
let MyError = function (message) {
    this.message = message || 'Default Message';
    Error.captureStackTrace(this, MyError);
}

const initCustomError = function (errName) {
    const supError = new Error();
    MyError.prototype = supError;
    MyError.prototype.name = errName || 'MyError';
    MyError.prototype.constructor = MyError;
};

module.exports = {
    initCustomError: initCustomError,
    customError: function () {
        return MyError;
    }
}
