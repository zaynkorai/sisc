export const templateIndex = `// index.js
import { runFullSimulation, LLMClient, Critic, Mutator, Provisioner } from "sisc";
import { openai } from "@ai-sdk/openai";
import config from "./sisc.config.js";
import { MyActor } from "./agents/MyActor.js";

// Ensure you have OPENAI_API_KEY in your environment, or pass it to LLMClient.
const llmClient = new LLMClient(openai("gpt-5-nano"));

// The default components required for the simulation.
const judge = new Critic(
    "Standard scoring rubric: Evaluate fairness and efficiency.",
    "You are a rigorous judge evaluating agent interactions.",
    llmClient
);
const mutator = new Mutator(
    "You are an optimization engine. Suggest strategy improvements based on failure analysis.",
    llmClient
);
const provisioner = new Provisioner(
    "You are an architectural designer. Design new agent archetypes to break deadlocks.",
    llmClient
);

// Your custom starting state
const initialState = {
    // Define the environment variables or context your agents act within
    scenario: "Negotiate a fair price for a used car.",
    dealerPrice: 10000,
    buyerBudget: 8000,
    currentOffer: null,
};

// Your initial actors
const agents = {
    "buyer-1": new MyActor("buyer-1", "You are the buyer. Try to get the price down to 8000."),
    "dealer-1": new MyActor("dealer-1", "You are the dealer. Do not sell for less than 9000."),
};

async function main() {
    console.log("Starting SISC simulation...");
    
    await runFullSimulation({
        config,
        initialState,
        agents,
        judge,
        mutator,
        provisioner,
        llmClient,
        maxGenerations: 10,
        onGenerationComplete: (generation, results) => {
            console.log(\`Generation \${generation} complete. Results: \${results.length}\`);
        }
    });
}

main().catch(console.error);
`;
