
const AGENTS = [];

async function getAgents() {
    return AGENTS.filter((a) => a.active);
}

async function addAgent(agent) {
    const newAgent = {
          id: "agent_" + Date.now(),
          name: agent.name,
          email: agent.email,
          brokerage: agent.brokerage,
          active: true,
          createdAt: new Date().toISOString(),
    };
    AGENTS.push(newAgent);
    return newAgent;
}

async function removeAgent(email) {
    const agent = AGENTS.find((a) => a.email === email);
    if (agent) agent.active = false;
}

module.exports = { getAgents, addAgent, removeAgent };
