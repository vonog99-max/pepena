const fs = require('fs');
let content = fs.readFileSync('src/data/db.ts', 'utf8');

const lines = content.split('\n');

const stage = `  { id: 'event-global-boss', worldName: 'Event', stageName: 'Global Boss', isBoss: true, enemies: ['global_boss_event'], rewards: { gold: 1000000, gems: 10000, xp: 50000 } },`;
const stageInsertIndex = lines.findIndex(line => line.includes('export const STAGES_DATABASE: WorldStage[] = [')) + 1;

if (stageInsertIndex > 0 && !content.includes('event-global-boss')) {
  lines.splice(stageInsertIndex, 0, stage);
}

fs.writeFileSync('src/data/db.ts', lines.join('\n'));
