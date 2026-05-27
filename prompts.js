const templateGuides={"anime-trailer":{name:"Anime Trailer",focus:"cinematic trailer pacing, strong hook, memorable visual symbols, narration, character dialogue hits, and fast production-ready shot planning",structure:"cold open, world reveal, mystery escalation, character reaction, final hook",deliverable:"a trailer production pack"},"episode-one":{name:"Episode 1",focus:"pilot episode clarity, world rules, protagonist motivation, central conflict, episode ending, and future story debts",structure:"opening image, ordinary world, disturbance, investigation, escalation, ending hook",deliverable:"an episode-one production pack"},"mystery-hook":{name:"Mystery Hook",focus:"unanswered questions, clues, misdirection, suspense, comment-bait theories, and payoff options",structure:"impossible event, witness, clue, denial, danger, unanswered final image",deliverable:"a mystery-first short-form production pack"},"character-reveal":{name:"Character Reveal",focus:"dramatic character entrance, silhouette, visual identity, dialogue line, hidden power, and audience curiosity",structure:"rumor, arrival, close-up details, action hint, signature line, unresolved question",deliverable:"a character reveal production pack"},"dark-fantasy-short":{name:"Dark Fantasy Short",focus:"atmosphere, lore density, emotional stakes, gothic visuals, sound design, and cinematic short-form pacing",structure:"mood opener, strange rule, character discovery, danger, symbolic ending",deliverable:"a dark fantasy cinematic short production pack"}};
const detailGuides={"fast-draft":{name:"Fast draft",instruction:"Keep the output concise but still useful. Prioritize fast decisions, compact lists, and practical production notes."},"studio-detailed":{name:"Studio detailed",instruction:"Give a detailed studio-style response with clear sections, useful lists, and production-ready guidance."},"maximum-detail":{name:"Maximum detail",instruction:"Go deep. Include more shots, more variations, more continuity warnings, stronger visual direction, and detailed production logic."}};
const toolTitles={full:"Full Production Pack Prompt",storyDebts:"Story Debt Board Prompt",trailer:"Anime Trailer Script Prompt",storyboard:"Storyboard Plan Prompt",imagePrompts:"Image Prompt Pack",videoPrompts:"Video Prompt Pack",soundDesign:"Sound Design Plan Prompt",continuity:"Continuity Check Prompt"};
const clean=(v,f="Not provided")=>String(v||"").trim()||f;
const tpl=p=>templateGuides[p.templateType]||templateGuides["anime-trailer"];
const det=p=>detailGuides[p.detailLevel]||detailGuides["studio-detailed"];
function role(){return `You are an elite anime showrunner, storyboard director, production manager, prompt engineer, sound designer, and continuity supervisor.

Your job is to convert a raw story idea into a practical production plan for a solo creator using AI image tools, AI video tools, voiceover tools, and CapCut/Premiere-style editing.

Rules:
- Be specific, cinematic, and production-ready.
- Keep continuity consistent with world rules.
- Respect the avoid list.
- Include concrete shots, camera angles, sound cues, and editing notes.
- Separate creative decisions from production instructions.
- Use clear headings so the creator can copy sections into other tools.`}
function ctx(p){const t=tpl(p),d=det(p);return `PROJECT CONTEXT
Project title: ${clean(p.title,"Untitled anime project")}
Story idea: ${clean(p.storyIdea)}
Genre: ${clean(p.genre)}
Animation style: ${clean(p.style)}
Target format: ${clean(p.targetFormat)}
Target platform: ${clean(p.platform)}
Target length: ${clean(p.length)}
Tone: ${clean(p.tone)}
Main character: ${clean(p.mainCharacter)}
Main mystery: ${clean(p.mainMystery)}
World rules: ${clean(p.worldRules)}
Avoid list: ${clean(p.avoid)}

SELECTED TEMPLATE
Template: ${t.name}
Template focus: ${t.focus}
Suggested structure: ${t.structure}
Expected deliverable: ${t.deliverable}

DETAIL LEVEL
Mode: ${d.name}
Instruction: ${d.instruction}`;}
function quality(){return `QUALITY CONTRACT
Before finalizing, make sure the output has:
- a strong opening hook
- clear story debts
- visual continuity rules
- camera angles and shot movement
- sound and edit rhythm
- AI prompt-ready language
- negative prompts / avoid rules
- no generic advice`;}
export const getToolTitle=tool=>toolTitles[tool]||"Generated Production Prompt";
export function buildProjectSummary(p){const t=tpl(p),d=det(p);return `# Project Summary

**Title:** ${clean(p.title,"Untitled anime project")}
**Story idea:** ${clean(p.storyIdea)}
**Genre:** ${clean(p.genre)}
**Style:** ${clean(p.style)}
**Format:** ${clean(p.targetFormat)}
**Platform:** ${clean(p.platform)}
**Length:** ${clean(p.length)}
**Tone:** ${clean(p.tone)}
**Main character:** ${clean(p.mainCharacter)}
**Main mystery:** ${clean(p.mainMystery)}

## Template
${t.name}

## Template focus
${t.focus}

## Detail mode
${d.name}

## World rules
${clean(p.worldRules)}

## Avoid list
${clean(p.avoid)}

## Recommended first module
Generate the Full Production Pack first, then generate Image Prompts and Video Prompts separately for cleaner production assets.`}
export function buildPromptByTool(tool,p){return({full:buildFullProductionPrompt,storyDebts:buildStoryDebtPrompt,trailer:buildTrailerPrompt,storyboard:buildStoryboardPrompt,imagePrompts:buildImagePromptPack,videoPrompts:buildVideoPromptPack,soundDesign:buildSoundDesignPrompt,continuity:buildContinuityPrompt}[tool]||buildFullProductionPrompt)(p)}
export function buildFullProductionPrompt(p){return `${role()}

${ctx(p)}

${quality()}

TASK
Create a complete anime production pack.

OUTPUT FORMAT

# 1. Logline
Write a powerful one-sentence concept.

# 2. Core Story Debts
List the biggest mysteries, promises, secrets, betrayals, emotional questions, object debts, location debts, and payoff possibilities. For each debt include the debt name, type, why it hooks the audience, how to tease it visually, possible payoff, and best trailer/episode moment.

# 3. Trailer or Episode Structure
Create a beat-by-beat structure for the selected format and target length. Include timestamp range, purpose, visual focus, narration/dialogue, and sound cue.

# 4. Narration Script
Write a polished voiceover script with cinematic pacing and bracketed performance notes.

# 5. Character Dialogue Moments
Add short trailer-friendly lines from characters.

# 6. Scene List
For each scene include location, characters, story purpose, visual mood, key action, and transition.

# 7. Shot List
For each shot include shot duration, camera angle, camera movement, subject/action, lighting, composition, transition, and AI video notes.

# 8. Image Prompt Pack
Create image prompts for major shots with subject, environment, camera angle, lighting, mood, style, continuity constraints, and negative prompt.

# 9. Video Prompt Pack
Create 5-second image-to-video prompts with reference image needed, 2-4 cuts, motion, character action, atmosphere movement, transition, and avoid list.

# 10. Sound Design Plan
List ambience, sound effects, music mood, impacts, risers, silence moments, and voiceover pacing.

# 11. Editing Timeline
Create a practical CapCut/Premiere edit plan with timing, subtitles, cuts, transitions, audio moments, and pacing notes.

# 12. Continuity Warnings
List possible mistakes that could break the world, style, plot, or visual consistency. Give fixes.

# 13. Production Checklist
End with a checklist the creator can follow from script to final edit.`}
export function buildStoryDebtPrompt(p){return `${role()}

${ctx(p)}

${quality()}

TASK
Analyze this project using the Story Debt system. A story debt is any mystery, promise, secret, prophecy, character flaw, betrayal, object, forbidden location, missing person, unanswered question, or emotional wound that the story opens and must eventually pay off.

OUTPUT FORMAT
# Story Debt Board
Create at least 15 story debts. For each include: debt name, type, opened by, why audience cares, visual symbol, connected characters, connected location, trailer tease, delay method, and 3 payoff options.

# Priority Ranking
Rank the top 5 debts by trailer strength.

# Viral Hook Options
Create 10 short hook lines based on the strongest debts.

# Production Conversion
Choose 5 debts and turn each into a scene idea, image prompt idea, 5-second video prompt idea, and sound cue.`}
export function buildTrailerPrompt(p){return `${role()}

${ctx(p)}

${quality()}

TASK
Create a production-ready anime trailer script.

OUTPUT FORMAT
# Trailer Strategy
Explain the main emotional hook and mystery hook.

# Timestamped Trailer Script
For each timestamp section include visual action, voiceover, character dialogue, sound cue, editing pace, and transition.

# Narrator Script Only
Extract the voiceover script for text-to-speech.

# Character Lines Only
Extract all character lines.

# Trailer Ending
Give 5 alternate final lines or images.

# Production Notes
List the minimum images, video clips, and sound effects needed.`}
export function buildStoryboardPrompt(p){return `${role()}

${ctx(p)}

${quality()}

TASK
Create a storyboard plan.

OUTPUT FORMAT
# Storyboard Overview
Explain visual direction.

# Panel-by-Panel Storyboard
Create 12-24 panels. For each include panel number, scene, shot size, camera angle, composition, character placement, background details, lighting, action, emotion, dialogue/narration, and transition.

# Layout Notes
Add notes for staging, silhouettes, depth, and contrast.

# Image Generation Order
Give the best order to generate images so style stays consistent.`}
export function buildImagePromptPack(p){return `${role()}

${ctx(p)}

${quality()}

TASK
Create an AI image prompt pack.

OUTPUT FORMAT
# Global Style Lock
Write one reusable style paragraph.

# Character Prompts
Create prompts for main characters, guards, townsfolk, extras, and important figures.

# Location Prompts
Create prompts for major locations and establishing shots.

# Prop and Symbol Prompts
Create prompts for important objects, signs, devices, symbols, or mysterious items.

# Scene Image Prompts
Create a numbered image prompt for each major shot. Each prompt must include subject, action, environment, camera angle, composition, lighting, mood, animation style, color palette, continuity rules, and negative prompt.

# Batch Plan
Group prompts into generation batches.`}
export function buildVideoPromptPack(p){return `${role()}

${ctx(p)}

${quality()}

TASK
Create 5-second AI image-to-video prompts.

OUTPUT FORMAT
# Video Style Lock
Write one reusable motion style paragraph.

# Clip List
Create 8-16 clips. For each include clip number, reference image needed, purpose, 5-second action, cut 1, cut 2, cut 3 if useful, camera movement, character movement, environmental motion, transition out, sound cue, and avoid list.

# Edit Assembly Order
List the final order and why.`}
export function buildSoundDesignPrompt(p){return `${role()}

${ctx(p)}

${quality()}

TASK
Create a sound design plan.

OUTPUT FORMAT
# Sound Identity
Describe the overall sonic identity.

# Ambience
List location ambience and background textures.

# Sound Effects
Group by environment, character movement, machines/technology/magic, impacts, transitions, and mystery moments.

# Music Direction
Describe music style, instruments, intensity curve, and emotional build.

# Timestamped Audio Plan
Create a timestamped plan for the selected length.

# Silence Moments
List where silence should be used.

# Search Keywords
Give safe search keywords for royalty-free sound effects.`}
export function buildContinuityPrompt(p){return `${role()}

${ctx(p)}

${quality()}

TASK
Act as continuity supervisor.

OUTPUT FORMAT
# Continuity Rules
List fixed rules for world, lighting, color palette, character design, locations, props, story logic, tone, and camera style.

# Risk Report
Find at least 20 possible mistakes. For each include problem, why it hurts production, where it might happen, how to prevent it, and how to fix it.

# AI Generation Warnings
List common AI image/video mistakes for this project.

# Final Checklist
Create a checklist before editing/exporting.

# Revision Prompt
Write a prompt to check the finished production plan.`}