/**
 * One small, provisional *topic* per candidate project, for the first portal
 * bubble. Curated from docs/PROJECT_INVENTORY.md one-line descriptions.
 * These are mood/subject hints, not verified tags or sales copy.
 * Later: review descriptions/devlogs and curate richer multi-point metadata.
 */
export const projectTopics:Readonly<Record<string,string>>=Object.freeze({
  "babuni-dev": "Interactive portfolio",
  "rocket-game-42": "Arcade defence",
  "button-game": "Reaction game",
  "socialforever": "Social addon",
  "roarforever": "Game audio",
  "flourishforever": "Roleplay",
  "azeroth-moments": "Media automation",
  "anskar-grotzschnapf": "Generative art",
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
  "buxbrewcharge": "Action emotes",
  "buxbrew": "Character work",
  "amazin": "Stealth addon",
  "warriorstartattack": "Combat helper",
  "roar-guild-and-community": "Community",
  "buxbrew-character-story": "Character story",
  "grimnir": "Fantasy culture",
  "morkahja-rpg": "Fantasy RPG",
  "morkahjaworld": "Worldbuilding",
  "arcanitebrothers": "Administration tools",
  "babuni-gaming": "Gaming and streaming",
  "mighty-morkah": "Music and audio art"
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
  "rocket-game-42": [
    "Mothership defence",
    "Browser and Electron"
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
    "Guild invitations",
    "Character behavior"
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
    "Action-bar slot",
    "Built-in emotes"
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
  "roar-guild-and-community": [
    "WoW community",
    "Shared rituals"
  ],
  "buxbrew-character-story": [
    "Jasmine Amberbrew",
    "Roleplay story"
  ],
  "grimnir": [
    "Morkahja world",
    "Cultural stories"
  ],
  "morkahja-rpg": [
    "Multiplayer",
    "Adventure design"
  ],
  "morkahjaworld": [
    "Elemental peoples",
    "Fantasy places"
  ],
  "arcanitebrothers": [
    "Admin console",
    "Morkahja origins"
  ],
  "babuni-gaming": ["World of Warcraft", "Add-ons and moments"],
  "mighty-morkah": ["YouTube channel", "SoundCloud"]
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
