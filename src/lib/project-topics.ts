/**
 * One small, provisional *topic* per candidate project, for the first portal
 * bubble. Curated from docs/PROJECT_INVENTORY.md one-line descriptions.
 * These are mood/subject hints, not verified tags or sales copy.
 * Later: review descriptions/devlogs and curate richer multi-point metadata.
 */
export const projectTopics:Readonly<Record<string,string>>=Object.freeze({
  "babuni-dev": "Interactive portfolio",
  "button-game": "Reaction game",
  "socialforever": "Social addon",
  "roarforever": "Game audio",
  "flourishforever": "Roleplay",
  "azeroth-moments": "Media automation",
  "anskar-grotzschnapf": "Generative art",
  "local-prompt-lab": "Image experiments",
  "local-ai-workstation": "Local AI",
  "resistforever": "Combat mechanics",
  "favorcraft": "Crafting tools",
  "redridge-recipe-planner": "Crafting planner",
  "wow-forever-talent-design-atlas": "Game design",
  "ethera-the-stonewrought": "Fantasy RPG",
  "enchantvisuals": "Visual effects",
  "totemtimers": "Shaman addon",
  "groupbufftoggle": "Interface addon",
  "lootfeed": "Loot interface",
  "gathermap": "Exploration tools",
  "battlereport": "Combat analytics",
  "roarguild": "Guild tools",
  "workthatgodbod": "Wellness addon",
  "the-great-iceflow-relay": "Player minigame",
  "roarrunlimited": "Roleplay emotes",
  "roarr": "Roleplay emotes",
  "roarsounds": "Game audio",
  "roaremotetrigger": "Roleplay emotes",
  "roar": "Roleplay emotes",
  "meleestartattack": "Combat helper",
  "buxbrewresist": "Combat mechanics",
  "buxbrewding": "WoW addon",
  "buxbrewcharge": "Combat helper",
  "buxbrew": "Character work",
  "amazin": "Stealth addon",
  "warriorstartattack": "Combat helper",
  "guildchatai": "Chat experiment",
  "practical-templates-creator": "Digital templates",
  "human-ai-development-journal": "Creative process",
  "roar-guild-and-community": "Community",
  "the-amberbrew-family": "Character lore",
  "buxbrew-character-story": "Character story",
  "fantasy-rpg-assets": "Fantasy art",
  "fantasy-architecture": "Architecture",
  "warehouse-performance-model": "Scoring systems",
  "dual-pc-streaming-setup": "Streaming setup",
  "morkahja-world-and-peoples": "Worldbuilding",
  "grimnir": "Fantasy culture",
  "morkahja-rpg": "Fantasy RPG",
  "morkahja-admin-console": "Admin tools",
  "morkahjaworld": "World project",
  "arcanitebrothers": "Development tools",
  "mech-arena": "Sci-fi RPG",
  "analubia": "Fantasy RPG"
});
export function topicForProject(projectId:string):string {
  return projectTopics[projectId]??'Creative work';
}
