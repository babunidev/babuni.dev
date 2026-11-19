/** Projects merged into one collection, with where their old addresses now lead.
 * On 2026-11-19 Babuni moved 21 finished addons for the 1.12 and 3.3.5 clients into
 * babunidev/ClassicWoWAddons, one folder each. Their former tiles are retired; their
 * project pages and `#project=` links forward to the matching folder module. */
export const CLASSIC_WOW_PROJECT='classic-wow-addons';
/** Former project id -> folder in the collection repository. */
export const MERGED_PROJECTS:Readonly<Record<string,string>>=Object.freeze({
  buxbrewcharge:'ActionEmotes-1',buxbrew:'ActionEmotes-2',amazin:'StealthEmotes',
  roar:'BattleEmotesLegacy',roarr:'BattleEmotes',roarrunlimited:'MultiActionEmotes',
  roarguild:'RoarGuildAddon',roaremotetrigger:'RoarGuildAddonWrath',roarsounds:'RoarSoundEffects',
  totemtimers:'TotemTimers',groupbufftoggle:'GroupBuffToggle',lootfeed:'LootFeed',
  battlereport:'BattleReport',workthatgodbod:'WorkThatGodBod','the-great-iceflow-relay':'TheGreatIceflowRelay',
  meleestartattack:'MeleeStartAttack',warriorstartattack:'WarriorStartAttack',buxbrewresist:'ResistInsight',
  buxbrewding:'LevelUpAnnouncer',guildchatai:'GuildChatBridge',enchantvisuals:'EnchantVisuals'
});
/** Standard module id of a former project -> its document inside the folder. */
const MODULE_DOCUMENTS:Readonly<Record<string,string>>={
  overview:'README.md',concept:'docs/CONCEPT.md',journal:'docs/DEVLOG.md',changes:'CHANGELOG.md',
  architecture:'docs/ARCHITECTURE.md',design:'docs/DESIGN.md',decisions:'docs/DECISIONS.md',
  collaboration:'docs/AI_COLLABORATION.md',roadmap:'docs/ROADMAP.md',content:'docs/CONTENT.md'
};
/** Folder module id the site generates for a collection folder. */
export function folderModuleId(folder:string):string{return 'folder-'+folder.toLowerCase();}
/** Where an old project link should open now, or null when the project was not merged. */
export function mergedProjectTarget(project:string,read:string|null):{project:string;read:string;doc:string|null}|null{
  const folder=MERGED_PROJECTS[project];
  if(!folder)return null;
  const document=read?MODULE_DOCUMENTS[read]:undefined;
  return {project:CLASSIC_WOW_PROJECT,read:folderModuleId(folder),doc:document?folder+'/'+document:null};
}
