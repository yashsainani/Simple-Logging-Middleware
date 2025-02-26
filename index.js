const express = require('express');

const app = express();

var a = 1;

app.use((req, res, next) => {
    req.responseTime = Date.now();

    res.on('close', () => {
        console.log(`RESPONSE WAS GIVEN IN ${Date.now() - req.responseTime}ms`);
    });

    next();
});

app.get('/api/v1/logging-middleware', (req, res) => {

    res
    .status(200)
    .json({
        state: 'success',
        requestInfo: {
            requestedUrl: req.url,
            requestedMethod: req.method,
            timestamp: new Date().toISOString(),
            responseTime: `${Date.now() - req.responseTime}ms`,
            requestedNo: a ++,
            ipAddress: req.ip === '::1' ? '127.0.0.1' : req.ip
        }
    })
});

app.use('*', (req, res) => {
    res
    .status(404)
    .json({
        state: 'failed',
        reason: 'Wrong Url Has Been Called'
    })
})

app.listen(5000, () => console.log('SERVER IS UP & RUNNING ON PORT 5000'));