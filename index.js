require("dotenv").config();
const express = require("express");
const cron = require("node-cron");
const { scrapeMarketData } = require("./src/scraper");
const { generateReport } = require("./src/report");
const { sendReport } = require("./src/email");
const { getAgents } = require("./src/agents");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ status: "running", product: "LakeLine Reports" });
});

app.post("/test-report", async (req, res) => {
    try {
          const { email, name, brokerage } = req.body;
          const testAgent = {
                  id: "test",
                  name: name || "Test Agent",
                  email: email || "test@example.com",
                  brokerage: brokerage || "Test Brokerage",
          };
          const marketData = await scrapeMarketData();
          const report = await generateReport(marketData, testAgent);
          await sendReport(testAgent, report, marketData);
          res.json({ success: true, message: "Test report sent to " + testAgent.email });
    } catch (error) {
          res.status(500).json({ success: false, error: error.message });
    }
});

app.post("/send-reports", async (req, res) => {
    try {
          await runWeeklyReports();
          res.json({ success: true });
    } catch (error) {
          res.status(500).json({ success: false, error: error.message });
    }
});

cron.schedule("0 7 * * 1", async () => {
    console.log("Weekly cron triggered");
    await runWeeklyReports();
}, { timezone: "America/Chicago" });

async function runWeeklyReports() {
    const marketData = await scrapeMarketData();
    const agents = await getAgents();
    for (const agent of agents) {
          try {
                  const report = await generateReport(marketData, agent);
                  await sendReport(agent, report, marketData);
                  console.log("Sent to " + agent.email);
          } catch (e) {
                  console.error("Failed:", e.message);
          }
    }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("LakeLine Reports running on port " + PORT);
});
