export const templateConfig = `// sisc.config.js
/** @type {import('sisc').FrameworkConfig} */
export default {
    max_concurrency: 2,
    epoch_size: 4,
    shadow_trial_count: 3,
    scout_sweep_interval_generations: 5,
    improvement_margin: 0.1,
    creation_patience: 3,
    require_human_approval_for_creation: true,
};
`;
