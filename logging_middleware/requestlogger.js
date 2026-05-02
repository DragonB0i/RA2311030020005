const Log = require('./logger');

const requestLogger = async (req, res, next) => {
    const startTime = Date.now();

    // Log incoming request
    await Log(
        "backend",
        "info",
        "middleware",
        `Incoming ${req.method} ${req.originalUrl}`
    );

    // Capture response end
    res.on("finish", async () => {
        const duration = Date.now() - startTime;

        await Log(
            "backend",
            "info",
            "middleware",
            `${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`
        );
    });

    next();
};

module.exports = requestLogger;