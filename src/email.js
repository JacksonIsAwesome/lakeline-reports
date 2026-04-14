
const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

async function sendReport(agent, report, marketData) {
    console.log("Sending report to " + agent.email);
    const html = buildHTML(agent, report, marketData);
    const { data, error } = await resend.emails.send({
          from: "LakeLine Reports <onboarding@resend.dev>",
          to: [agent.email],
          subject: "Your Minneapolis Market Report - " + marketData.week,
          html,
    });
    if (error) throw new Error(JSON.stringify(error));
    console.log("Email sent: " + data.id);
    return data;
}

function buildHTML(agent, report, marketData) {
    return `<!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin:0;padding:0;background:#f4f6f8;font-family:-apple-system,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;background:#f4f6f8;">
    <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0">
    <tr><td style="background:linear-gradient(135deg,#1a3a5c,#2d6a9f);border-radius:12px 12px 0 0;padding:32px 40px;text-align:center;">
    <h1 style="margin:0;color:#fff;font-size:28px;">LakeLine Reports</h1>
    <p style="margin:8px 0 0;color:#a8c8e8;font-size:14px;">Minneapolis Real Estate Market Intelligence</p>
    </td></tr>
    <tr><td style="background:#2d6a9f;padding:12px 40px;text-align:center;">
    <p style="margin:0;color:#fff;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">${marketData.week}</p>
    </td></tr>
    <tr><td style="background:#fff;padding:40px;">
    <p style="font-size:16px;color:#333;">Hi <strong>${agent.name}</strong>,</p>
    <p style="font-size:15px;color:#555;">Here is your weekly Minneapolis market snapshot.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
    <tr>
    <td style="padding:0 8px 12px 0;width:50%;"><div style="background:#f8f9fa;border-radius:8px;padding:16px;text-align:center;"><p style="margin:0 0 4px;font-size:11px;color:#999;text-transform:uppercase;">Median Sale Price</p><p style="margin:0;font-size:20px;font-weight:700;color:#1a3a5c;">${marketData.medianSalePrice}</p><p style="margin:4px 0 0;font-size:11px;color:#2d6a9f;">${marketData.medianPriceChange} vs last year</p></div></td>
    <td style="padding:0 0 12px 8px;width:50%;"><div style="background:#f8f9fa;border-radius:8px;padding:16px;text-align:center;"><p style="margin:0 0 4px;font-size:11px;color:#999;text-transform:uppercase;">Avg Days on Market</p><p style="margin:0;font-size:20px;font-weight:700;color:#1a3a5c;">${marketData.avgDaysOnMarket}</p><p style="margin:4px 0 0;font-size:11px;color:#2d6a9f;">${marketData.daysOnMarketChange}</p></div></td>
    </tr>
    <tr>
    <td style="padding:0 8px 12px 0;width:50%;"><div style="background:#f8f9fa;border-radius:8px;padding:16px;text-align:center;"><p style="margin:0 0 4px;font-size:11px;color:#999;text-transform:uppercase;">New Listings</p><p style="margin:0;font-size:20px;font-weight:700;color:#1a3a5c;">${marketData.newListings}</p><p style="margin:4px 0 0;font-size:11px;color:#2d6a9f;">this week</p></div></td>
    <td style="padding:0 0 12px 8px;width:50%;"><div style="background:#f8f9fa;border-radius:8px;padding:16px;text-align:center;"><p style="margin:0 0 4px;font-size:11px;color:#999;text-transform:uppercase;">Homes Sold</p><p style="margin:0;font-size:20px;font-weight:700;color:#1a3a5c;">${marketData.homesSold}</p><p style="margin:4px 0 0;font-size:11px;color:#2d6a9f;">this week</p></div></td>
    </tr>
    <tr>
    <td style="padding:0 8px 0 0;width:50%;"><div style="background:#f8f9fa;border-radius:8px;padding:16px;text-align:center;"><p style="margin:0 0 4px;font-size:11px;color:#999;text-transform:uppercase;">Months of Inventory</p><p style="margin:0;font-size:20px;font-weight:700;color:#1a3a5c;">${marketData.monthsOfInventory}</p><p style="margin:4px 0 0;font-size:11px;color:#2d6a9f;">supply</p></div></td>
    <td style="padding:0 0 0 8px;width:50%;"><div style="background:#f8f9fa;border-radius:8px;padding:16px;text-align:center;"><p style="margin:0 0 4px;font-size:11px;color:#999;text-transform:uppercase;">Sale-to-List Ratio</p><p style="margin:0;font-size:20px;font-weight:700;color:#1a3a5c;">${marketData.saleToListRatio}</p><p style="margin:4px 0 0;font-size:11px;color:#2d6a9f;">of listings</p></div></td>
    </tr>
    </table>
    <div style="background:#f0f7ff;border-left:4px solid #2d6a9f;border-radius:0 8px 8px 0;padding:24px;margin-bottom:24px;">
    <p style="margin:0 0 12px;font-size:12px;font-weight:700;color:#2d6a9f;text-transform:uppercase;letter-spacing:1px;">Market Insight</p>
    <p style="margin:0;font-size:15px;color:#333;line-height:1.7;">${report.insight}</p>
    </div>
    <p style="margin:0;font-size:13px;color:#999;text-align:center;">Powered by LakeLine Reports</p>
    </td></tr>
    <tr><td style="background:#1a3a5c;border-radius:0 0 12px 12px;padding:20px 40px;text-align:center;">
    <p style="margin:0;color:#a8c8e8;font-size:13px;">${agent.name} - ${agent.brokerage}</p>
    </td></tr>
    </table>
    </td></tr>
    </table>
    </body>
    </html>`;
}

module.exports = { sendReport };
