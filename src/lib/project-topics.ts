/** Curated topic keywords; short editorial hints rather than release claims. */
export type TopicPoint='top'|'left'|'right';
export const TOPIC_POINTS:readonly TopicPoint[]=['top','left','right'];

/** Nine curated, provisional keywords per project; no release-status claims. */
export const WOW_ADDON_IDS:readonly string[]=["guildchatai", "amazin", "battlereport", "buxbrew", "buxbrewcharge", "buxbrewding", "buxbrewresist", "favorcraft", "flourishforever", "gathermap", "groupbufftoggle", "lootfeed", "meleestartattack", "resistforever", "roar", "roaremotetrigger", "roarforever", "roarguild", "roarr", "roarrunlimited", "roarsounds", "socialforever", "totemtimers", "warriorstartattack", "workthatgodbod"];
export const projectKeywordPools:Readonly<Record<string,readonly string[]>>=Object.freeze({
  "guildchatai": ["World of Warcraft add-on", "Guild chat", "Roleplay experiment", "Paused prototype", "Character voice", "Manual chat command", "Lua", "Guild roster", "Local AI concept"],
  "babuni-dev": [
    "Interactive portfolio",
    "Living grid",
    "Creative process",
    "Project discovery",
    "Small bloom",
    "Big bloom",
    "Markdown reader",
    "Human and AI",
    "Development journal"
  ],
  "rocket-game-42": [
    "Arcade defence",
    "Mothership defence",
    "Browser game",
    "Electron",
    "Rocket Game 42",
    "Game development",
    "Space combat",
    "Project journal",
    "Game experiments"
  ],
  "button-game": [
    "Reaction game",
    "Android game",
    "Local multiplayer",
    "Button Game",
    "Game development",
    "Player reactions",
    "Game experiments",
    "Project journal",
    "Play and improve"
  ],
  "socialforever": [
    "World of Warcraft add-on",
    "Player memory",
    "WoW encounters",
    "Social tools",
    "Player interactions",
    "Character names",
    "Lua",
    "User interface",
    "Game community"
  ],
  "roarforever": [
    "World of Warcraft add-on",
    "Game audio",
    "WoW Forever",
    "Emote voices",
    "Character sounds",
    "Roleplay",
    "Lua",
    "Audio tools",
    "Game interface"
  ],
  "flourishforever": [
    "World of Warcraft add-on",
    "Roleplay",
    "Ability triggers",
    "Character emotes",
    "Player actions",
    "Emote tools",
    "Lua",
    "Character expression",
    "Game interface"
  ],
  "azeroth-moments": [
    "Media automation",
    "Screenshots",
    "Automatic sharing",
    "World of Warcraft",
    "Gaming moments",
    "Visual memories",
    "Game captures",
    "Media workflow",
    "Azeroth"
  ],
  "anskar-grotzschnapf": [
    "Generative art",
    "Poetry",
    "Digital prints",
    "AI images",
    "Visual experiments",
    "Creative writing",
    "Art and words",
    "Image composition",
    "Artist project"
  ],
  "local-ai-workstation": [
    "Local AI",
    "Language models",
    "Image generation",
    "AI experiments",
    "Local tools",
    "Creative workflow",
    "Workstation",
    "Model exploration",
    "Human and AI"
  ],
  "resistforever": [
    "World of Warcraft add-on",
    "Combat mechanics",
    "Tooltips",
    "Spell resistance",
    "Combat information",
    "Lua",
    "User interface",
    "Spell details",
    "Combat tools"
  ],
  "favorcraft": [
    "World of Warcraft add-on",
    "Crafting tools",
    "Professions",
    "Materials",
    "Crafting information",
    "Lua",
    "Game interface",
    "Crafting workflow",
    "Profession tools"
  ],
  "ethera-the-stonewrought": [
    "Fantasy RPG",
    "Godot",
    "Morkahja universe",
    "Experimental prototype",
    "AI models",
    "Tripo",
    "World design",
    "Game concepts",
    "Creative experiments"
  ],
  "enchantvisuals": [
    "Visual effects",
    "Weapon effects",
    "Client mod",
    "World of Warcraft",
    "Weapon visuals",
    "Game presentation",
    "Enchantment art",
    "Visual experiments",
    "Character equipment"
  ],
  "totemtimers": [
    "World of Warcraft add-on",
    "Shaman tools",
    "Totems and shields",
    "Totem timers",
    "Shaman interface",
    "Lua",
    "Spell information",
    "Class tools",
    "Combat interface"
  ],
  "groupbufftoggle": [
    "World of Warcraft add-on",
    "Party frames",
    "Buff controls",
    "Group interface",
    "Spell display",
    "Lua",
    "Interface controls",
    "Buff information",
    "Party tools"
  ],
  "lootfeed": [
    "World of Warcraft add-on",
    "Loot interface",
    "Group rolls",
    "Animated display",
    "Loot information",
    "Lua",
    "Group loot",
    "Interface feedback",
    "Game interface"
  ],
  "gathermap": [
    "World of Warcraft add-on",
    "Exploration tools",
    "Resource mapping",
    "Self-learning",
    "Gathering",
    "Map information",
    "Lua",
    "World exploration",
    "Gathering tools"
  ],
  "battlereport": [
    "World of Warcraft add-on",
    "Combat analytics",
    "Encounters",
    "Combat statistics",
    "Combat information",
    "Lua",
    "Battle reports",
    "Encounter history",
    "Combat tools"
  ],
  "roarguild": [
    "World of Warcraft add-on",
    "Action emotes",
    "Guild invitations",
    "Roarboard",
    "Character profiles",
    "Custom emote pools",
    "Shared message board",
    "Community tools",
    "Lua"
],
  "workthatgodbod": [
    "World of Warcraft add-on",
    "Wellness prompts",
    "Movement cues",
    "Hydration",
    "Everyday movement",
    "Roleplay prompts",
    "Lua",
    "Player wellbeing",
    "Friendly reminders"
  ],
  "the-great-iceflow-relay": [
    "Player minigame",
    "Checkpoint relay",
    "Player organized",
    "World of Warcraft",
    "Community play",
    "Relay race",
    "Azeroth",
    "Game event",
    "Shared adventure"
  ],
  "roarrunlimited": [
    "World of Warcraft add-on",
    "Multiple action slots",
    "Independent cooldowns",
    "Chance controls",
    "Built-in emotes",
    "Numbered configurations",
    "Character expression",
    "Roleplay tools",
    "Lua"
],
  "roarr": [
    "World of Warcraft add-on",
    "Battle emotes",
    "Action-bar slot",
    "Built-in emotes",
    "Chance controls",
    "Cooldown controls",
    "Setup tutorial",
    "Character expression",
    "Lua"
],
  "roarsounds": [
    "World of Warcraft add-on",
    "Roar sound effects",
    "Character sounds",
    "Emote events",
    "Race and sex",
    "Unit identity",
    "Lua",
    "Audio restoration",
    "Roleplay audio"
],
  "roaremotetrigger": [
    "World of Warcraft add-on",
    "Wrath 3.3.5",
    "Action-bar slots",
    "Native emotes",
    "Chance controls",
    "Cooldown controls",
    "Character profiles",
    "Guild messages",
    "Lua"
],
  "roar": [
    "World of Warcraft add-on",
    "Battle emotes",
    "Action-bar slot",
    "Built-in emotes",
    "Chance controls",
    "Cooldown controls",
    "Character flavor",
    "Lua",
    "Legacy project"
],
  "meleestartattack": [
    "World of Warcraft add-on",
    "Combat helper",
    "Melee classes",
    "Start attacks",
    "Combat controls",
    "Lua",
    "Player abilities",
    "Melee tools",
    "Game interface"
  ],
  "buxbrewresist": [
    "World of Warcraft add-on",
    "Spell resistance",
    "Damage estimates",
    "Character tooltips",
    "On hold",
    "ResistForever origins",
    "Lua",
    "Combat explanations",
    "Resistance stats"
],
  "buxbrewding": [
    "World of Warcraft add-on",
    "Level-up announcements",
    "Guild chat",
    "60 roleplay messages",
    "Local previews",
    "Manual announcements",
    "Lua",
    "Character milestones",
    "Roleplay"
],
  "buxbrewcharge": [
    "World of Warcraft add-on",
    "Action emotes",
    "Action-bar slot",
    "Built-in emotes",
    "ActionEmotes #1",
    "Lua",
    "Character expression",
    "Player actions",
    "Roleplay tools"
  ],
  "buxbrew": [
    "World of Warcraft add-on",
    "ActionEmotes #2",
    "Custom emotes",
    "Action-bar slot",
    "Character voice",
    "Per-character settings",
    "Roleplay writing",
    "EMOTE chat",
    "Lua"
],
  "amazin": [
    "World of Warcraft add-on",
    "Stealth emotes",
    "Rested XP",
    "Character expression",
    "Player actions",
    "Lua",
    "Roleplay tools",
    "Action-bar slot",
    "Game interface"
  ],
  "warriorstartattack": [
    "World of Warcraft add-on",
    "Combat helper",
    "Warrior abilities",
    "Auto-attack",
    "Combat controls",
    "Lua",
    "Melee tools",
    "Warrior tools",
    "Game interface"
  ],
  "roar-guild-and-community": [
    "Community",
    "WoW community",
    "Shared rituals",
    "Guild life",
    "Roleplay",
    "Player stories",
    "Shared adventures",
    "Azeroth",
    "Community design"
  ],
  "amberbrew-story": [
    "Amberbrew Story",
    "Jasmine Amberbrew",
    "Roleplay story",
    "World of Warcraft",
    "Character writing",
    "Azeroth",
    "Storytelling",
    "Fantasy character",
    "Creative writing"
  ],
  "grimnir": [
    "Fantasy culture",
    "Morkahja world",
    "Cultural stories",
    "Worldbuilding",
    "Fantasy peoples",
    "Lore",
    "Storytelling",
    "Creative writing",
    "World design"
  ],
  "morkahja-rpg": [
    "Fantasy RPG",
    "Multiplayer",
    "Adventure design",
    "Browser game",
    "AI artwork",
    "Human-made music",
    "Handcrafted UI",
    "World of Morkahja",
    "Game development"
  ],
  "morkahjaworld": [
    "Worldbuilding",
    "Morkahja world",
    "Project documentation",
    "Reserved project",
    "Creative direction",
    "World design",
    "Project history",
    "Future possibilities",
    "Work in progress"
  ],
  "arcanitebrothers": [
    "Administration tools",
    "Admin console",
    "Morkahja origins",
    "Babuni Admin",
    "Content editing",
    "Player management",
    "Local tools",
    "Project documentation",
    "Development workflow"
  ],
  "babuni-gaming": [
    "Gaming and streaming",
    "World of Warcraft",
    "YouTube",
    "Instagram",
    "CurseForge",
    "Gaming moments",
    "Shared experiences",
    "Game streams",
    "Community"
  ],
  "mighty-morkah": [
    "Music and audio art",
    "YouTube channel",
    "SoundCloud",
    "Piano music",
    "Audio experiments",
    "Music videos",
    "Original music",
    "Creative process",
    "Musical exploration"
  ]
});

function shuffled<T>(values:readonly T[],random:()=>number):T[]{
  const result=[...values];
  for(let i=result.length-1;i>0;i--){
    const value=random();
    const fraction=Number.isFinite(value)?Math.max(0,Math.min(.999999,value)):0;
    const j=Math.floor(fraction*(i+1));
    [result[i],result[j]]=[result[j],result[i]];
  }
  return result;
}

/** Fresh labels for one reveal. Add-ons always keep their shared type cue,
 * with two other distinct keywords; all three positions remain random. */
export function topicLabelsForProject(projectId:string,random:()=>number=Math.random):Readonly<Record<TopicPoint,string>> {
  const pool=projectKeywordPools[projectId]??['Creative work','Project notes','More to explore'];
  const addon=WOW_ADDON_IDS.includes(projectId);
  const candidates=shuffled(pool.filter(label=>!addon||label!=='World of Warcraft add-on'),random);
  const labels=shuffled(addon?['World of Warcraft add-on',...candidates.slice(0,2)]:candidates.slice(0,3),random);
  return {top:labels[0],left:labels[1],right:labels[2]};
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
