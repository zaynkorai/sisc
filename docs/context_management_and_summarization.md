# Context Management & Summarization

As simulations scale in complexity (more turns) or breadth (more agents), "Context Window Pressure" threatens reasoning accuracy. This document outlines the framework's protocol for managing large context volumes.

## 1. The Multi-Tiered Context Stack

To prevent "Context Drowning," the Environment does not pass the raw history to agents. Instead, it constructs a **Triage Context**:

| Tier | Type | Pruning Strategy |
| :--- | :--- | :--- |
| **Tier 1: The Core** | System Prompt + Agent Strategy | **Immutable.** Never pruned. |
| **Tier 2: The Now** | Current `StateObject` + Last 3 Turns | **Full Resolution.** |
| **Tier 3: The Recent** | Turns 4–10 | **High-Level Bullet Points.** |
| **Tier 4: The Deep History** | Everything older than 10 turns | **Recursive Summary.** |

## 2. Recursive Summarization Protocol

Every $N$ turns (default $N=5$), the environment triggers a background agent to update the **Compressed Episode History**:

1. **Extract Key Commitments:** Identify settled points in the `StateObject`.
2. **Extract Emotional Trajectory:** Summarize the tension levels and "vibe" of the negotiation.
3. **Discard Noise:** Remove greetings, repetitive arguments, and redundant JSON blocks.
4. **Update:** The compressed history replaces the raw transcript for all moves pre-dating the sliding window.

## 3. Semantic State Pruning

The `GenericStateObject` can grow large. The environment maintains a **Mutation Counter** for every field.

* **Hot Fields:** Fields mutated in the last 2 turns (Always visible).
* **Warm Fields:** Fields mutated in the last 5 turns (Condensed).
* **Cold Fields:** Fields untouched for >10 turns. These are moved to "Archived State"—agents can query them via a `search_history` tool, but they aren't forced into the default prompt.

## 4. Pruning Internal Monologues

While the **Capitalizer Agent** needs to see all internal monologues to find hidden overlaps, the **Primary Actors** do NOT.

* **Privacy Guard:** Each agent *only* sees its own past internal monologues.
* **Recency Bias:** Only the last 2 internal monologues are included. Older monologues are condensed into a "Strategic Summary" so the agent remembers its broad plan without re-reading the raw tokens of its past thoughts.

## 5. Mathematical Enforcement

The **Judge** is instructed to look at the *raw log* (archived database) while the **Actors** see the *pruned log*. If an agent loses track of a key goal due to over-pruning, the Judge will assign a low score, causing the **Arena** to reject that summarization configuration. This forces the system to find the "Optimal Pruning Balance."
