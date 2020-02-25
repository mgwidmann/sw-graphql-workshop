const { app } = require('./src/app');

const listener = app.listen(process.env.PORT || 3000, () => {
    let host = listener.address().address;
    if (host === '::') {
        host = 'localhost';
    }
    const port = listener.address().port;
    // eslint-disable-next-line no-console
    console.log('Listening at http://%s%s', host, port === 80 ? '' : ':' + port);
});