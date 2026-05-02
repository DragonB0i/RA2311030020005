const Log = require('./index');

(async () => {
    const result = await Log(
        "backend",
        "info",
        "service",
        "Server started successfully"
    );

    console.log(result); // 👈 THIS WAS MISSING
})();