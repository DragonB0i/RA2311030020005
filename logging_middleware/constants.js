const STACKS = ["backend", "frontend"];

const LEVELS = ["debug", "info", "warn", "error", "fatal"];

const BACKEND_PACKAGES = [
    "cache", "controller", "cron_job", "db",
    "domain", "handler", "repository", "route", "service"
];

const COMMON_PACKAGES = [
    "auth", "config", "middleware", "utils"
];

module.exports = {
    STACKS,
    LEVELS,
    BACKEND_PACKAGES,
    COMMON_PACKAGES
};