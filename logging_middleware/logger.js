const axios = require('axios');
const validateLog = require('./validator');

const LOG_API = "http://20.207.122.201/evaluation-service/logs";

// 🔐 Paste your token here
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJiYjAyNDFAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwMzE2NywiaWF0IjoxNzc3NzAyMjY3LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiMDhiYzBhNjMtOTdiMC00MmU5LWIzMWItZjJiNGNjOWRiNTI4IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoieWFnbmVzd2FyIGIiLCJzdWIiOiJkNzE4ZTY5YS0wOTYyLTRkOTktOTBkZS1jNThkMzIyM2E4MjEifSwiZW1haWwiOiJiYjAyNDFAc3JtaXN0LmVkdS5pbiIsIm5hbWUiOiJ5YWduZXN3YXIgYiIsInJvbGxObyI6InJhMjMxMTAzMDAyMDAwNSIsImFjY2Vzc0NvZGUiOiJRa2JweEgiLCJjbGllbnRJRCI6ImQ3MThlNjlhLTA5NjItNGQ5OS05MGRlLWM1OGQzMjIzYTgyMSIsImNsaWVudFNlY3JldCI6IlNrQUVWakd1QXlua3V4c3kifQ.uZWDNXMJKXYtC506ZpLvlaPJfkavp9xfEc77OnC8e9Q";

// control logging state
let isLoggingEnabled = true;

async function Log(stack, level, pkg, message) {

    if (!isLoggingEnabled) {
        return { success: false, message: "Logging disabled" };
    }

    try {
        validateLog(stack, level, pkg, message);

        const response = await axios.post(
            LOG_API,
            {
                stack,
                level,
                package: pkg,
                message
            },
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return {
            success: true,
            data: response.data
        };

    } catch (error) {

        if (error.response) {

            // 🔴 Handle invalid token ONCE
            if (error.response.status === 401) {
                isLoggingEnabled = false;

                console.error("❌ Logging disabled: Invalid or expired token");

                return {
                    success: false,
                    message: "Invalid token"
                };
            }

            return {
                success: false,
                message: error.response.data
            };

        } else {
            return {
                success: false,
                message: error.message
            };
        }
    }
}

module.exports = Log;