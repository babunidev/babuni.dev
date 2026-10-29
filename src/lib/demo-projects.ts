/**
 * Provisional visual project tiles transcribed from docs/PROJECT_INVENTORY.md
 * (53 initial candidates, 2026-10-26; 45 retained after curation, music and Babuni Gaming additions on 2026-10-28).
 * Removed duplicates and non-projects are documented in the source inventory.
 * Remaining provisional entries still need review. This is a data snapshot:
 * revisit/verify the source before promoting an entry to real portfolio content.
 */
export interface DemoProject {
  /** Provisional stable candidate key, independent of recycled tile position. */
  id: string;
  name: string;
  shortSummary: string;
  /** The inventory's evidence classification, not a release status. */
  evidence: string;
  tint: string;
  /** Optional public URL for artwork clipped by the shared circular portal. */
  portalArtwork?: string;
}
export const DEMO_PROJECT_COUNT=45;
export const demoProjects:readonly DemoProject[]=[
  {
    "id": "babuni-dev",
    "portalArtwork": "/portal-content/PortalContentBabuniDev.webp",
    "name": "BABUNI.DEV",
    "shortSummary": "Interactive creative portfolio with a living tile grid and exploratory project views.",
    "evidence": "repo",
    "tint": "#b78af9"
  },
  {
    "id": "button-game",
    "portalArtwork": "/portal-content/PortalContentButtonGame.webp",
    "name": "Button Game",
    "shortSummary": "Android reaction game with scores, leaderboard and local multiplayer hosting.",
    "evidence": "repo",
    "tint": "#568cdb"
  },
  {
    "id": "socialforever",
    "portalArtwork": "/portal-content/SocialForever.webp",
    "name": "SocialForever",
    "shortSummary": "WoW social memory and player encounter addon.",
    "evidence": "repo",
    "tint": "#d3a457"
  },
  {
    "id": "roarforever",
    "portalArtwork": "/portal-content/RoarForever.webp",
    "name": "RoarForever",
    "shortSummary": "Restores missing player emote voice sounds in WoW Forever.",
    "evidence": "repo",
    "tint": "#6ac0a5"
  },
  {
    "id": "flourishforever",
    "portalArtwork": "/portal-content/FlourishForever.webp",
    "name": "FlourishForever",
    "shortSummary": "Configurable ability-triggered roleplay emotes.",
    "evidence": "repo",
    "tint": "#c778b9"
  },
  {
    "id": "azeroth-moments",
    "portalArtwork": "/portal-content/AzerothMoments.webp",
    "name": "Azeroth Moments",
    "shortSummary": "Automated screenshot/video posting from a local folder to social channels.",
    "evidence": "repo",
    "tint": "#db7859"
  },
  {
    "id": "anskar-grotzschnapf",
    "portalArtwork": "/portal-content/AnskarGrotzschnapf.webp",
    "name": "Anskar Grotzschnapf",
    "shortSummary": "Poetry-to-image automated artist and digital-print publishing experiment.",
    "evidence": "repo",
    "tint": "#8c8be3"
  },
  {
    "id": "local-ai-workstation",
    "portalArtwork": "/portal-content/LocalAAIWorkstation.webp",
    "name": "Local AI Workstation",
    "shortSummary": "Local language-model and image-generation development environment.",
    "evidence": "conversation",
    "tint": "#c1b56d"
  },
  {
    "id": "resistforever",
    "portalArtwork": "/portal-content/ResistForever.webp",
    "name": "ResistForever",
    "shortSummary": "Partial-resist and spell-miss tooltip calculations.",
    "evidence": "repo",
    "tint": "#61afb9"
  },
  {
    "id": "favorcraft",
    "portalArtwork": "/portal-content/FavorCraft.webp",
    "name": "FavorCraft",
    "shortSummary": "Merchant's Favor profession, recipe and materials planner.",
    "evidence": "repo",
    "tint": "#ab88d1"
  },
  {
    "id": "ethera-the-stonewrought",
    "portalArtwork": "/portal-content/Ethera.webp",
    "name": "Ethera: The Stonewrought",
    "shortSummary": "Godot RPG/simulation chapter set in the Morkahja universe.",
    "evidence": "repo",
    "tint": "hsl(125 58% 62%)"
  },
  {
    "id": "enchantvisuals",
    "portalArtwork": "/portal-content/EnchantVisuals.webp",
    "name": "EnchantVisuals",
    "shortSummary": "Native client mod combining weapon enchant and imbue visuals.",
    "evidence": "repo",
    "tint": "hsl(263 58% 62%)"
  },
  {
    "id": "totemtimers",
    "portalArtwork": "/portal-content/TotemTimers.webp",
    "name": "TotemTimers",
    "shortSummary": "Shaman totem, shield and weapon-enhancement tracking.",
    "evidence": "repo",
    "tint": "hsl(40 58% 62%)"
  },
  {
    "id": "groupbufftoggle",
    "name": "GroupBuffToggle",
    "shortSummary": "Toggleable party and target unit-frame buffs.",
    "evidence": "repo",
    "tint": "hsl(178 58% 62%)"
  },
  {
    "id": "lootfeed",
    "name": "LootFeed",
    "shortSummary": "Animated loot and group-roll information display.",
    "evidence": "repo",
    "tint": "hsl(315 58% 62%)"
  },
  {
    "id": "gathermap",
    "name": "GatherMap",
    "shortSummary": "Self-learning resource gathering map overlay.",
    "evidence": "repo",
    "tint": "hsl(93 58% 62%)"
  },
  {
    "id": "battlereport",
    "portalArtwork": "/portal-content/BattleReport.webp",
    "name": "BattleReport",
    "shortSummary": "Personal encounter and combat-statistics reporter.",
    "evidence": "repo",
    "tint": "hsl(230 58% 62%)"
  },
  {
    "id": "roarguild",
    "portalArtwork": "/portal-content/RoarGuildAddon.webp",
    "name": "RoarGuild Add-on",
    "shortSummary": "WoW guild add-on for invitations and guild-character behavior, as described by Babuni.dev.",
    "evidence": "repo",
    "tint": "hsl(8 58% 62%)"
  },
  {
    "id": "workthatgodbod",
    "portalArtwork": "/portal-content/WorkThatGodBod.webp",
    "name": "WorkThatGodBod",
    "shortSummary": "In-game posture, movement and hydration reminders.",
    "evidence": "repo",
    "tint": "hsl(145 58% 62%)"
  },
  {
    "id": "the-great-iceflow-relay",
    "portalArtwork": "/portal-content/TheGreatIceflowRelay.webp",
    "name": "The Great Iceflow Relay",
    "shortSummary": "Player-organized WoW ball-passing checkpoint minigame.",
    "evidence": "repo",
    "tint": "hsl(283 58% 62%)"
  },
  {
    "id": "roarrunlimited",
    "name": "ROARRunlimited",
    "shortSummary": "Multiple action-slot emote triggers with independent options.",
    "evidence": "repo-lineage",
    "tint": "hsl(60 58% 62%)"
  },
  {
    "id": "roarr",
    "portalArtwork": "/portal-content/ROARR.webp",
    "name": "ROARR",
    "shortSummary": "Earlier action-slot battle-emote addon.",
    "evidence": "repo-lineage",
    "tint": "hsl(198 58% 62%)"
  },
  {
    "id": "roarsounds",
    "name": "ROARSounds",
    "shortSummary": "Earlier restoration of roar audio effects.",
    "evidence": "repo-lineage",
    "tint": "hsl(335 58% 62%)"
  },
  {
    "id": "roaremotetrigger",
    "name": "ROARemoteTrigger",
    "shortSummary": "Battle-emote triggers for the Wrath client.",
    "evidence": "repo-lineage",
    "tint": "hsl(113 58% 62%)"
  },
  {
    "id": "roar",
    "name": "ROAR",
    "shortSummary": "Early random battle-emote tool.",
    "evidence": "repo-lineage",
    "tint": "hsl(250 58% 62%)"
  },
  {
    "id": "meleestartattack",
    "portalArtwork": "/portal-content/MeleeStartAttack.webp",
    "name": "MeleeStartAttack",
    "shortSummary": "Attack-start helper for several melee classes.",
    "evidence": "repo",
    "tint": "hsl(28 58% 62%)"
  },
  {
    "id": "buxbrewresist",
    "portalArtwork": "/portal-content/BuxbrewResist.webp",
    "name": "BuxbrewResist",
    "shortSummary": "Earlier spell-resistance tooltip addon.",
    "evidence": "repo-lineage",
    "tint": "hsl(165 58% 62%)"
  },
  {
    "id": "buxbrewding",
    "portalArtwork": "/portal-content/BuxbrewDing.webp",
    "name": "BuxbrewDing",
    "shortSummary": "Named WoW addon; purpose not yet confirmed.",
    "evidence": "name-only",
    "tint": "hsl(303 58% 62%)"
  },
  {
    "id": "buxbrewcharge",
    "portalArtwork": "/portal-content/BuxbrewCharge.webp",
    "name": "BuxbrewCharge",
    "shortSummary": "Charge-related WoW addon.",
    "evidence": "repo",
    "tint": "hsl(80 58% 62%)"
  },
  {
    "id": "buxbrew",
    "portalArtwork": "/portal-content/BuxbrewAddon.webp",
    "name": "Buxbrew Addon",
    "shortSummary": "Named character-related repository; purpose not yet confirmed.",
    "evidence": "name-only",
    "tint": "hsl(218 58% 62%)"
  },
  {
    "id": "amazin",
    "name": "Amazin",
    "shortSummary": "Stealth-emote addon with rested experience reporting.",
    "evidence": "repo",
    "tint": "hsl(355 58% 62%)"
  },
  {
    "id": "warriorstartattack",
    "portalArtwork": "/portal-content/WarriorStartAttack.webp",
    "name": "WarriorStartAttack",
    "shortSummary": "Auto-attack helper for warrior abilities.",
    "evidence": "repo-lineage",
    "tint": "hsl(133 58% 62%)"
  },
  {
    "id": "roar-guild-and-community",
    "name": "Roar Guild",
    "shortSummary": "WoW guild community design and shared roleplaying rituals.",
    "evidence": "conversation",
    "tint": "hsl(323 58% 62%)",
    "portalArtwork": "/portal-content/ROARGuild.webp"
  },
  {
    "id": "buxbrew-character-story",
    "portalArtwork": "/portal-content/BuxbrewCharacter.webp",
    "name": "Buxbrew — character story",
    "shortSummary": "Roleplaying story of Jasmine 'Buxbrew' Amberbrew.",
    "evidence": "conversation",
    "tint": "hsl(238 58% 62%)"
  },
  {
    "id": "fantasy-rpg-assets",
    "name": "Fantasy RPG Assets",
    "shortSummary": "Top-down trees and other environmental art studies.",
    "evidence": "conversation",
    "tint": "hsl(15 58% 62%)"
  },
  {
    "id": "fantasy-architecture",
    "name": "Fantasy Architecture",
    "shortSummary": "Fantasy building plans, gateways and architectural studies.",
    "evidence": "conversation",
    "tint": "hsl(153 58% 62%)"
  },
  {
    "id": "grimnir",
    "name": "Grimnir",
    "shortSummary": "Cultural and narrative material within the Morkahja world.",
    "evidence": "repo-context",
    "tint": "hsl(343 58% 62%)"
  },
  {
    "id": "morkahja-rpg",
    "portalArtwork": "/portal-content/Morkahja.webp",
    "name": "Morkahja",
    "shortSummary": "Multiplayer fantasy adventure game and development history.",
    "evidence": "repo-context",
    "tint": "hsl(120 58% 62%)"
  },
  {
    "id": "morkahjaworld",
    "name": "Morkahja Worldbuilding",
    "shortSummary": "Worldbuilding for Morkahja: its peoples, places, cultures and lore.",
    "evidence": "human-confirmed",
    "tint": "hsl(35 58% 62%)"
  },
  {
    "id": "arcanitebrothers",
    "name": "Babuni Admin",
    "shortSummary": "Administration tool previously listed as Arcanitebrothers, with public documentation of its Morkahja admin origins.",
    "evidence": "repo",
    "tint": "hsl(173 58% 62%)",
    "portalArtwork": "/portal-content/ArcaniteBrothers.webp"
  },
  {
    "id": "analubia",
    "name": "Analubia",
    "shortSummary": "Historical fantasy RPG project associated with Sundust Studios.",
    "evidence": "conversation",
    "tint": "hsl(88 58% 62%)"
  },
  {
    "id": "rocket-game-42",
    "name": "Rocket Game 42",
    "shortSummary": "Arcade mothership-defence game reconstructed for the browser and packaged with Electron.",
    "evidence": "repo",
    "tint": "#b57348"
  },
  {
    "id": "mighty-morkah",
    "name": "Mighty Morkah",
    "shortSummary": "Piano music and videos by Babuni.dev, published on the Mighty Morkah YouTube channel.",
    "evidence": "human-confirmed",
    "tint": "#9b86bc"
  },
  {
    "id": "elixior",
    "name": "Elixior",
    "shortSummary": "Music and audio art by Babuni.dev, including earlier pieces published on SoundCloud.",
    "evidence": "human-confirmed",
    "tint": "#d59057"
  },
  {
    "id": "babuni-gaming",
    "name": "Babuni Gaming",
    "shortSummary": "Gaming, streaming and sharing experiences across games, currently focused on World of Warcraft, with connections to add-on work and Azeroth Moments.",
    "evidence": "human-confirmed",
    "tint": "#edaa35",
    "portalArtwork": "/portal-content/BabuniGaming.webp"
  }
];
