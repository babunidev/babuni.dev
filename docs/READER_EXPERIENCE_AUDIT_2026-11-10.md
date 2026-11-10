# Repository documentation readability review — 10 November 2026

This is an editorial inventory of the **41 repositories** accessible under `babunidev` at the time of the review. The immediate goal was to make project introductions readable for human visitors, not to homogenize the voice of every creative work.

**Scope of this pass:** inspected the README entry points and Markdown-file inventories across all 41 repositories, reviewed relevant contributor/documentation instructions, rewrote eight overloaded public guides, improved related guild pages, and adopted the shared reader-first writing guide where the former common guide was present. **This was not a sentence-by-sentence revision of every Markdown file.**

## What changed

| Repository | Public reading improvement | Detail retained |
| --- | --- | --- |
| [ButtonGame](https://github.com/babunidev/ButtonGame) | Gameplay, platforms, LAN setup and release limits presented before provenance | Creative origins, QA, signing and release history in existing reference files |
| [babuni.admin](https://github.com/babunidev/babuni.admin) | Workspaces, local setup, credentials and trust boundaries separated | Existing technical, security and operating documents |
| [ROARguild](https://github.com/babunidev/ROARguild) | ROAR versus Amberhearth clarified; concept, guild guide and Sunday fires rewritten | Previous concept decisions marked as history; no unratified rule made binding |
| [eldgrim](https://github.com/babunidev/eldgrim) | Character and narrative presented separately from bot, agent, addon and governance | Distinct technical specifications and 16-chapter non-ratified framework |
| [FlourishForever](https://github.com/babunidev/FlourishForever) | Player guide and current ability-lock behavior moved to the front | Dated release/cooldown investigations in `docs/RELEASE_DEVELOPMENT_NOTES.md` |
| [RoarForever](https://github.com/babunidev/RoarForever) | Voice restoration, installation and controls made the entry point | Full emote list and technical behavior in `docs/EMOTE_REFERENCE.md` |
| [Morkahja](https://github.com/babunidev/Morkahja) | Game introduction and reading map replace dated audit opening | Status, test and pull-request history in `docs/RELEASE_STATUS_HISTORY.md` |
| [ResistForever](https://github.com/babunidev/ResistForever) | Tooltip explanation, installation and limitations precede equations | Formulas, API research and dated release checks in `docs/MODEL_REFERENCE.md` |

The eight rewritten READMEs have **146 local Markdown links** in total; their targets were checked against the current repository file trees and none were missing. GitHub contents writes were confirmed. No game/client source, deployment, database or release artifact was changed in this pass.

## The other 33 repositories

These introductions were inspected and **left substantially unchanged** in this pass. Many already have a clear personal origin or practical explanation; rewriting them merely to fit a template would flatten their character.

### Earlier emotes, guild tools and gameplay addons

[ActionEmotes-1](https://github.com/babunidev/ActionEmotes-1), [ActionEmotes-2](https://github.com/babunidev/ActionEmotes-2), [StealthEmotes](https://github.com/babunidev/StealthEmotes), [LevelUpAnnouncer](https://github.com/babunidev/LevelUpAnnouncer), [BattleEmotesLegacy](https://github.com/babunidev/BattleEmotesLegacy), [BattleEmotes](https://github.com/babunidev/BattleEmotes), [WorkThatGodBod](https://github.com/babunidev/WorkThatGodBod), [MultiActionEmotes](https://github.com/babunidev/MultiActionEmotes), [RoarSoundEffects](https://github.com/babunidev/RoarSoundEffects), [RoarGuildAddon](https://github.com/babunidev/RoarGuildAddon), [RoarGuildAddonWrath](https://github.com/babunidev/RoarGuildAddonWrath), [WarriorStartAttack](https://github.com/babunidev/WarriorStartAttack), [MeleeStartAttack](https://github.com/babunidev/MeleeStartAttack), [GatherMap](https://github.com/babunidev/GatherMap), [BattleReport](https://github.com/babunidev/BattleReport), [LootFeed](https://github.com/babunidev/LootFeed), [GroupBuffToggle](https://github.com/babunidev/GroupBuffToggle), [TotemTimers](https://github.com/babunidev/TotemTimers), [EnchantVisuals](https://github.com/babunidev/EnchantVisuals), [ResistInsight](https://github.com/babunidev/ResistInsight), [SocialForever](https://github.com/babunidev/SocialForever), [favorcraft](https://github.com/babunidev/favorcraft), [ClearViewForever](https://github.com/babunidev/ClearViewForever), [TheGreatIceflowRelay](https://github.com/babunidev/TheGreatIceflowRelay).

### Games, worlds, stories, apps and reserved repositories

[Ethera](https://github.com/babunidev/Ethera), [MorkahjaWorld](https://github.com/babunidev/MorkahjaWorld), [AmberbrewStory](https://github.com/babunidev/AmberbrewStory), [Rocketgame42](https://github.com/babunidev/Rocketgame42), [GuildChatBridge](https://github.com/babunidev/GuildChatBridge), [AsnkarGrotzschnapf](https://github.com/babunidev/AsnkarGrotzschnapf), [AzerothMoments](https://github.com/babunidev/AzerothMoments) (reserved shell), [azeroth-moments](https://github.com/babunidev/azeroth-moments) (application), and [babuni.dev](https://github.com/babunidev/babuni.dev).

The README entry points were examined for structure and reading purpose, not fully verified against each runtime's latest source or live release.

## Shared standard

The standard in `docs/DOCUMENTATION.md` was rewritten to prioritize readable introductions, clear document purposes, separate historical references, faithful human–AI attribution, explicit evidence levels and working links. The common standard was updated in **38 repositories**. Three repositories had distinct guides: `ROARguild` was adapted for the new direction; `eldgrim` and `ClearViewForever` retained their project-specific guides.

The intention is **consistency of care, not identical prose**. An addon manual, a fantasy-world article and a development journal should remain different kinds of writing.

## Material that still needs deeper editorial review

The inventory exposed large areas where a front-page rewrite alone cannot solve readability:

- **babuni.dev:** very long architecture, design, content, decision, roadmap, changelog and development-journal documents need thematic organization and condensed reading paths without rewriting their history.
- **babuni.admin and ButtonGame:** historical changelogs, roadmaps and journals remain extensive; the new READMEs only improve entry and navigation.
- **Ethera:** its large design archive includes many dated snapshots. These should remain historically intact; clarify which current concepts are canonical before consolidating.
- **MorkahjaWorld and AmberbrewStory:** fictional lore, story chapters and canon require separate creative editing, not blanket repository text cleanup.
- **eldgrim:** the sixteen governance chapters and numbered decision register need an editorial pass that preserves approved answers, unanswered questions, privacy boundaries and charter status.

These are observed scope limits of this review, not promises that the deeper files were edited.

## Publication boundary

Changes were committed to the relevant GitHub repositories' default branches. The **babuni.dev website imports revision-pinned documentation snapshots**, so GitHub updates do **not** automatically update what readers see on the live site. A deliberate content sync, validation, build and separately approved release are distinct tasks.

The edits here are documentation-only. GitHub file writes and README link checks were performed; no gameplay tests, production deployments or live content synchronization were performed as part of this editorial review.
