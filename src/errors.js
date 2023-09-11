// wrap a single hook error and creates a rich error type
// that contains info regarding it's logical origin
const onItemError = (err, action) => {
    // eslint-disable-next-line
  const message =
    err && err.message
        ? err.message
        : typeof err === 'string'
            ? err
            : 'unknown error';

    const error = new Error(message);
    error.hook = action.hook;
    error.action = action.name;
    error.trace = action.trace;
    error.originalError = err;
    // error.traceStack = getCurrentTrace()

    throw error;
};

module.exports = {
    onItemError,
};
