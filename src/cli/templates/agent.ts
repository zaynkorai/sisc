export const templateAgent = `// agents/MyActor.js
import { ActorAgent } from "sisc";

export class MyActor extends ActorAgent {
    constructor(id, identity) {
        // Pass ID, role, archetype, personality, goals
        super(id, "Participant", "debater", [identity], ["Win the debate"]);
    }

    async step(state, context) {
        // 1. Evaluate current state 
        // 2. Decide action
        // 3. Return ActionProposal
        
        return {
            agent_id: this.id,
            action_type: "speak",
            payload: {
                message: "I think we should reconsider the premise.",
            },
            confidence: 0.8,
            internal_monologue: "I need to stall for time."
        };
    }
}
`;
