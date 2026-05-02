const {
    STACKS,
    LEVELS,
    BACKEND_PACKAGES,
    COMMON_PACKAGES
} = require('./constants');

function validateLog(stack, level, pkg, message) {

    if (!STACKS.includes(stack)) {
        throw new Error("Invalid stack");
    }

    if (!LEVELS.includes(level)) {
        throw new Error("Invalid level");
    }

    const allowedPackages = [...BACKEND_PACKAGES, ...COMMON_PACKAGES];

    if (!allowedPackages.includes(pkg)) {
        throw new Error("Invalid package");
    }

    if (!message || typeof message !== "string") {
        throw new Error("Message must be a string");
    }
}

module.exports = validateLog;