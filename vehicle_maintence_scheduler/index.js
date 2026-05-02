const axios = require('axios');

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJiYjAyNDFAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwNDY0OSwiaWF0IjoxNzc3NzAzNzQ5LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiOTk5ODcxNzQtZGQ5MC00YTM0LWJmMGEtZTQ3YWFkOGUyNjA5IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoieWFnbmVzd2FyIGIiLCJzdWIiOiJkNzE4ZTY5YS0wOTYyLTRkOTktOTBkZS1jNThkMzIyM2E4MjEifSwiZW1haWwiOiJiYjAyNDFAc3JtaXN0LmVkdS5pbiIsIm5hbWUiOiJ5YWduZXN3YXIgYiIsInJvbGxObyI6InJhMjMxMTAzMDAyMDAwNSIsImFjY2Vzc0NvZGUiOiJRa2JweEgiLCJjbGllbnRJRCI6ImQ3MThlNjlhLTA5NjItNGQ5OS05MGRlLWM1OGQzMjIzYTgyMSIsImNsaWVudFNlY3JldCI6IlNrQUVWakd1QXlua3V4c3kifQ.QwqAYklj9lPf-4FSMgI9r8WKhi5zxK2xyLPww3ANogw";

const DEPOT_API = "http://20.207.122.201/evaluation-service/depots";
const VEHICLE_API = "http://20.207.122.201/evaluation-service/vehicles";

// Fetch APIs
async function fetchData(url) {
    const res = await axios.get(url, {
        headers: {
            Authorization: `Bearer ${TOKEN}`
        }
    });
    return res.data;
}

// 🔥 KNAPSACK (optimized DP)
function knapsack(tasks, capacity) {
    const n = tasks.length;

    const dp = Array(n + 1)
        .fill(0)
        .map(() => Array(capacity + 1).fill(0));

    for (let i = 1; i <= n; i++) {
        const { Duration, Impact } = tasks[i - 1];

        for (let w = 0; w <= capacity; w++) {
            if (Duration <= w) {
                dp[i][w] = Math.max(
                    dp[i - 1][w],
                    Impact + dp[i - 1][w - Duration]
                );
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }

    // 🔍 Backtrack to find selected tasks
    let w = capacity;
    let selected = [];

    for (let i = n; i > 0 && w > 0; i--) {
        if (dp[i][w] !== dp[i - 1][w]) {
            selected.push(tasks[i - 1]);
            w -= tasks[i - 1].Duration;
        }
    }

    return {
        maxImpact: dp[n][capacity],
        selectedTasks: selected
    };
}

// 🚀 MAIN
async function run() {
    try {
        const depotData = await fetchData(DEPOT_API);
        const vehicleData = await fetchData(VEHICLE_API);

        const depots = depotData.depots;
        const vehicles = vehicleData.vehicles;

        for (let depot of depots) {
            console.log("\n============================");
            console.log(`Depot ID: ${depot.ID}`);
            console.log(`Mechanic Hours: ${depot.MechanicHours}`);

            const result = knapsack(vehicles, depot.MechanicHours);

            console.log(`Max Impact: ${result.maxImpact}`);
            console.log(`Tasks Selected: ${result.selectedTasks.length}`);

            result.selectedTasks.forEach(task => {
                console.log(
                    `TaskID: ${task.TaskID}, Duration: ${task.Duration}, Impact: ${task.Impact}`
                );
            });
        }

    } catch (err) {
        console.error("Error:", err.response?.data || err.message);
    }
}

run();