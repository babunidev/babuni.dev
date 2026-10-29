# Project menu grouping proposal — 2026-10-28

**Historical proposal, now approved and implemented with the corrections below on 2026-10-28.** This changes only the Projects menu, never grid order or positions. Every one of the 43 active projects appears once below.

## World of Warcraft (29)

- SocialForever (`socialforever`)
- RoarForever (`roarforever`)
- FlourishForever (`flourishforever`)
- Azeroth Moments (`azeroth-moments`)
- ResistForever (`resistforever`)
- FavorCraft (`favorcraft`)
- EnchantVisuals (`enchantvisuals`)
- TotemTimers (`totemtimers`)
- GroupBuffToggle (`groupbufftoggle`)
- LootFeed (`lootfeed`)
- GatherMap (`gathermap`)
- BattleReport (`battlereport`)
- RoarGuild (`roarguild`)
- WorkThatGodBod (`workthatgodbod`)
- The Great Iceflow Relay (`the-great-iceflow-relay`)
- ROARRunlimited (`roarrunlimited`)
- ROARR (`roarr`)
- ROARSounds (`roarsounds`)
- ROARemoteTrigger (`roaremotetrigger`)
- ROAR (`roar`)
- MeleeStartAttack (`meleestartattack`)
- BuxbrewResist (`buxbrewresist`)
- BuxbrewDing (`buxbrewding`)
- BuxbrewCharge (`buxbrewcharge`)
- Buxbrew (`buxbrew`)
- Amazin (`amazin`)
- WarriorStartAttack (`warriorstartattack`)
- Roar Guild (`roar-guild-and-community`)
- Buxbrew — character story (`buxbrew-character-story`)

## Morkahja (6)

- Ethera: The Stonewrought (`ethera-the-stonewrought`)
- Grimnir (`grimnir`)
- Morkahja (`morkahja-rpg`)
- Morkahja Admin Console (`morkahja-admin-console`)
- Morkahja Worldbuilding (`morkahjaworld`)
- Arcanitebrothers (`arcanitebrothers`)

## AI (5)

- BABUNI.DEV (`babuni-dev`)
- Anskar Grotzschnapf (`anskar-grotzschnapf`)
- Local AI Workstation (`local-ai-workstation`)
- Fantasy RPG Assets (`fantasy-rpg-assets`)
- Fantasy Architecture (`fantasy-architecture`)

## Games (3)

- Button Game (`button-game`)
- Rocket Game 42 (`rocket-game-42`)
- Analubia (`analubia`)

## Questions to settle before implementation

- **RoarGuild** is the existing addon/tool entry; **Roar Guild** is the renamed community entry. They now share the supplied guild artwork. Do these remain distinct projects or should they merge? No merge has been performed.
- **Arcanitebrothers** is documented as Morkahja Admin. **Morkahja Admin Console** remains a separate unresolved candidate. This may be another duplicate; no merge is assumed.
- **Fantasy RPG Assets / Fantasy Architecture** are provisionally under AI because the inventory describes visual studies. Move them under Morkahja if they are specifically that world's authored material.
- **Buxbrew** has a named repository but its purpose is still unclear; the character-story entry is also kept. Both are provisionally under World of Warcraft pending the human's classification.
- **Analubia** is provisionally under Games from the existing historical RPG description; status and completeness are not release claims.

No runtime group metadata, headings or ordering is added until Babuni.dev reviews this list. The requested project renames and Rocket Game 42 addition are separate authorized changes.

## Approved correction and implementation — 2026-10-28

Babuni.dev approved the menu-only grouping. Runtime membership is in `src/lib/project-groups.ts`: World of Warcraft (29), Morkahja (5), AI (5), Games (3), Music (2), totaling 44. The earlier list above is historical: Morkahja Admin Console was removed as a duplicate of retained Arcanitebrothers; RoarGuild is now RoarGuild Add-on and has no supplied image; Roar Guild community alone retains the guild image. Analubia remains after the human withdrew the removal suggestion. Music adds Mighty Morkah and Elixior as separate linked profiles. Other provisional placements follow the approved proposal. No category influences grid order or geometry.


## Babuni Gaming addition — 2026-10-28

Babuni.dev added Babuni Gaming as a distinct gaming, streaming and sharing project. AI placed it under Games for its all-games scope, despite the current WoW focus. Runtime counts now total 45: World of Warcraft 29, Morkahja 5, AI 5, Games 4, Music 2. The older proposed/approved lists above remain historical; Azeroth Moments and addon projects are not merged into this new project.


## Current naming correction — 2026-10-29

Babuni.dev renamed the project formerly listed as Arcanitebrothers to **Babuni Admin**. Stable website ID and Morkahja group membership remain unchanged. Its separate public documentation edition keeps the earlier repository name for now; implementation remains private. Earlier tables and narrative are historical.
