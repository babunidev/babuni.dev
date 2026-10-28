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
  "roar-guild-and-community": "Community",
  "the-amberbrew-family": "Character lore",
  "buxbrew-character-story": "Character story",
  "fantasy-rpg-assets": "Fantasy art",
  "fantasy-architecture": "Architecture",
  "warehouse-performance-model": "Scoring systems",
  "dual-pc-streaming-setup": "Streaming setup",
  "grimnir": "Fantasy culture",
  "morkahja-rpg": "Fantasy RPG",
  "morkahja-admin-console": "Admin tools",
  "morkahjaworld": "Worldbuilding",
  "arcanitebrothers": "Development tools",
  "mech-arena": "Sci-fi RPG",
  "analubia": "Fantasy RPG"
});
export function topicForProject(projectId:string):string {
  return projectTopics[projectId]??'Creative work';
}

/**
 * Two additional *draft* flavor snippets for the left and right marker.
 * Grounded conservatively in docs/PROJECT_INVENTORY.md's short summaries.
 * These are provisional editorial hints, not verified portfolio claims.
 * The existing top topic is preserved verbatim.
 */
export type TopicPoint='top'|'left'|'right';
export const TOPIC_POINTS:readonly TopicPoint[]=['top','left','right'];
export const supplementalTopics:Readonly<Record<string,readonly [string,string]>>=Object.freeze({
  "babuni-dev": [
    "Living grid",
    "Creative process"
  ],
  "button-game": [
    "Android game",
    "Local multiplayer"
  ],
  "socialforever": [
    "Player memory",
    "WoW encounters"
  ],
  "roarforever": [
    "WoW Forever",
    "Emote voices"
  ],
  "flourishforever": [
    "Ability triggers",
    "Character emotes"
  ],
  "azeroth-moments": [
    "Screenshots",
    "Automatic sharing"
  ],
  "anskar-grotzschnapf": [
    "Poetry",
    "Digital prints"
  ],
  "local-prompt-lab": [
    "Prompts & seeds",
    "Visual styles"
  ],
  "local-ai-workstation": [
    "Language models",
    "Image generation"
  ],
  "resistforever": [
    "Tooltips",
    "Spell resistance"
  ],
  "favorcraft": [
    "Professions",
    "Materials"
  ],
  "ethera-the-stonewrought": [
    "Godot",
    "Morkahja universe"
  ],
  "enchantvisuals": [
    "Weapon effects",
    "Client mod"
  ],
  "totemtimers": [
    "Totems & shields",
    "Shaman tools"
  ],
  "groupbufftoggle": [
    "Party frames",
    "Buff controls"
  ],
  "lootfeed": [
    "Group rolls",
    "Animated display"
  ],
  "gathermap": [
    "Resource mapping",
    "Self-learning"
  ],
  "battlereport": [
    "Encounters",
    "Combat statistics"
  ],
  "roarguild": [
    "Guild roleplay",
    "Message board"
  ],
  "workthatgodbod": [
    "Movement cues",
    "Hydration"
  ],
  "the-great-iceflow-relay": [
    "Checkpoint relay",
    "Player organized"
  ],
  "roarrunlimited": [
    "Action slots",
    "Emote options"
  ],
  "roarr": [
    "Battle emotes",
    "Earlier addon"
  ],
  "roarsounds": [
    "Roar effects",
    "Earlier audio work"
  ],
  "roaremotetrigger": [
    "Wrath client",
    "Battle triggers"
  ],
  "roar": [
    "Random emotes",
    "Early addon"
  ],
  "meleestartattack": [
    "Melee classes",
    "Start attacks"
  ],
  "buxbrewresist": [
    "Spell resistance",
    "Earlier addon"
  ],
  "buxbrewding": [
    "Named addon",
    "Details to explore"
  ],
  "buxbrewcharge": [
    "Charge ability",
    "WoW addon"
  ],
  "buxbrew": [
    "Named repository",
    "Details to explore"
  ],
  "amazin": [
    "Stealth emotes",
    "Rested XP"
  ],
  "warriorstartattack": [
    "Warrior abilities",
    "Auto-attack"
  ],
  "guildchatai": [
    "Guild chat",
    "Early experiment"
  ],
  "practical-templates-creator": [
    "Automation idea",
    "Useful templates"
  ],
  "roar-guild-and-community": [
    "WoW community",
    "Shared rituals"
  ],
  "the-amberbrew-family": [
    "Family stories",
    "Warcraft lore"
  ],
  "buxbrew-character-story": [
    "Jasmine Amberbrew",
    "Roleplay story"
  ],
  "fantasy-rpg-assets": [
    "Top-down art",
    "Environment studies"
  ],
  "fantasy-architecture": [
    "Building plans",
    "Fantasy gateways"
  ],
  "warehouse-performance-model": [
    "Fair scoring",
    "Workplace systems"
  ],
  "dual-pc-streaming-setup": [
    "Gaming PC",
    "Streaming PC"
  ],
  "grimnir": [
    "Morkahja world",
    "Cultural stories"
  ],
  "morkahja-rpg": [
    "Multiplayer",
    "Adventure design"
  ],
  "morkahja-admin-console": [
    "Web interface",
    "Server moderation"
  ],
  "morkahjaworld": [
    "Elemental peoples",
    "Fantasy places"
  ],
  "arcanitebrothers": [
    "Development identity",
    "Admin console"
  ],
  "mech-arena": [
    "Science fiction",
    "Historical RPG"
  ],
  "analubia": [
    "Sundust Studios",
    "Historical RPG"
  ]
});
export function topicLabelsForProject(projectId:string):Readonly<Record<TopicPoint,string>> {
  const [left,right]=supplementalTopics[projectId]??['Creative work','More to explore'];
  return {top:topicForProject(projectId),left,right};
}

/** Rotate spontaneous hints across the three markers instead of repeatedly
 * lighting the top point. Tests can provide a deterministic random fraction.
 */
export function chooseAmbientPoint(previous:TopicPoint|null,random:number):TopicPoint {
  const options=TOPIC_POINTS.filter(point=>point!==previous);
  const bounded=Math.max(0,Math.min(.999999,Number.isFinite(random)?random:0));
  return options[Math.floor(bounded*options.length)];
}

/** One random permutation, then a gently varied interval between reveals. */
export function topicRevealPlan(random:()=>number=Math.random):{point:TopicPoint;delay:number}[]{
  const points=[...TOPIC_POINTS];
  for(let i=points.length-1;i>0;i--){
    const j=Math.floor(random()*(i+1));
    [points[i],points[j]]=[points[j],points[i]];
  }
  let delay=0;
  return points.map((point,index)=>{
    if(index)delay+=260+Math.floor(random()*161);
    return {point,delay};
  });
}
