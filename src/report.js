
const Anthropic = require("@anthropic-ai/sdk");

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function generateReport(marketData, agent) {
    console.log("Generating AI insight for " + agent.name + "...");

  const prompt = "You are a Minneapolis real estate market expert. Write a 3-4 sentence market insight paragraph for agent " + agent.name + " at " + agent.brokerage + " based on this week's data:\n" +
        "- Median Sale Price: " + marketData.medianSalePrice + " (" + marketData.medianPriceChange + " vs last year)\n" +
        "- Avg Days on Market: " + marketData.avgDaysOnMarket + " (" + marketData.daysOnMarketChange + ")\n" +
        "- New Listings: " + marketData.newListings + "\n" +
        "- Homes Sold: " + marketData.homesSold + "\n" +
        "- Months of Inventory: " + marketData.monthsOfInventory + "\n" +
        "- Sale-to-List Ratio: " + marketData.saleToListRatio + "\n" +
        "- Price Reductions: " + marketData.priceReductions + "\n\n" +
        "Write a sharp, local-expert paragraph under 150 words. No bullet points, no fluff.";

  const message = await anthropic.messages.create({
        model: "claude-opus-4-5",
        max_tokens: 300,
        messages: [{ role: "user", content: prompt }],
  });

  return {
        insight: message.content[0].text,
        generatedAt: new Date().toISOString(),
  };
}

module.exports = { generateReport };
