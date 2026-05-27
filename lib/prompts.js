const templateGuides = {
  "anime-trailer": {
    name: "Anime Trailer",
    focus: "cinematic trailer pacing, strong hook, visual symbols, narration, dialogue hits, and shot planning"
  },
  "episode-one": {
    name: "Episode 1",
    focus: "pilot episode clarity, world rules, protagonist motivation, conflict, ending hook, and future story debts"
  },
  "mystery-hook": {
    name: "Mystery Hook",
    focus: "unanswered questions, clues, suspense, comment-bait theories, and payoff options"
  },
  "character-reveal": {
    name: "Character Reveal",
    focus: "dramatic character entrance, silhouette, visual identity, dialogue line, hidden power, and audience curiosity"
  },
  "dark-fantasy-short": {
    name: "Dark Fantasy Short",
    focus: "atmosphere, lore density, emotional stakes, gothic visuals, sound design, and short-form pacing"
  }
};

const toolTitles = {
  full: "Full Production Pack",
  storyDebts: "Story Debt Board",
  trailer: "Trailer Script",
  storyboard: "Storyboard",
  imagePrompts: "Image Prompt Pack",
  videoPrompts: "Video Prompt Pack",
  soundDesign: "Sound Design",
  continuity: "Continuity Check"
};

const clean = (value, fallback = "Not provided") => String(value || "").trim() || fallback;

export function getToolTitle(tool) {
  return toolTitles[tool] || "Production Output";
}

function projectContext(project) {
  const template = templateGuides[project.templateType] || templateGuides["anime-trailer"];

  return `PROJECT CONTEXT
Title: ${clean(project.title, "Untitled project")}
Story idea: ${clean(project.storyIdea)}
Genre: ${clean(project.genre)}
Animation style: ${clean(project.style)}
Target format: ${clean(project.targetFormat)}
Platform: ${clean(project.platform)}
Length: ${clean(project.length)}
Tone: ${clean(project.tone)}
Main character: ${clean(project.mainCharacter)}
Main mystery: ${clean(project.mainMystery)}
World rules: ${clean(project.worldRules)}
Avoid list: ${clean(project.avoid)}
Template: ${template.name}
Template focus: ${template.focus}`;
}

function role() {
  return `You are an elite anime showrunner, storyboard director, production manager, prompt engineer, sound designer, and continuity supervisor.

Your job is to convert a raw story idea into a practical production plan for a solo creator using AI image tools, AI video tools, voiceover tools, and CapCut/Premiere-style editing.

Rules:
- Be specific, cinematic, and production-ready.
- Keep continuity consistent with the world rules.
- Respect the avoid list.
- Include concrete shots, camera angles, sound cues, and editing notes.
- Use clear headings and practical checklists.`;
}

export function buildProjectSummary(project) {
  return `# Project Summary

**Title:** ${clean(project.title, "Untitled project")}
**Story idea:** ${clean(project.storyIdea)}
**Genre:** ${clean(project.genre)}
**Style:** ${clean(project.style)}
**Format:** ${clean(project.targetFormat)}
**Platform:** ${clean(project.platform)}
**Length:** ${clean(project.length)}
**Tone:** ${clean(project.tone)}
**Main character:** ${clean(project.mainCharacter)}
**Main mystery:** ${clean(project.mainMystery)}

## World rules
${clean(project.worldRules)}

## Avoid list
${clean(project.avoid)}`;
}

export function buildPromptByTool(tool, project) {
  const base = `${role()}

${projectContext(project)}

QUALITY CONTRACT
The output must have a strong hook, story debts, visual continuity, camera movement, sound design, edit rhythm, AI prompt-ready language, and negative prompts where needed.`;

  const tasks = {
    full: `Create a complete production pack with:
1. Logline
2. Core story debts
3. Beat-by-beat structure
4. Narration script
5. Character dialogue moments
6. Scene list
7. Shot list
8. Image prompt pack
9. Video prompt pack
10. Sound design plan
11. Editing timeline
12. Continuity warnings
13. Production checklist`,
    storyDebts: `Create at least 15 story debts. For each include name, type, audience hook, visual symbol, connected characters/locations, trailer tease, delay method, and 3 payoff options. Then rank the top 5 and convert 5 into scene/image/video/sound ideas.`,
    trailer: `Create a timestamped anime trailer script with voiceover, character lines, visuals, sound cues, editing pace, transitions, final hook, and minimum assets needed.`,
    storyboard: `Create a 12-24 panel storyboard. For each panel include shot size, camera angle, composition, characters, background, lighting, action, emotion, dialogue/narration, and transition.`,
    imagePrompts: `Create an AI image prompt pack with global style lock, character prompts, location prompts, prop/symbol prompts, scene prompts, negative prompts, and batch order.`,
    videoPrompts: `Create 8-16 five-second image-to-video prompts. Each must include reference image, purpose, action, 2-4 cuts, camera movement, character movement, environmental motion, transition, sound cue, and avoid list.`,
    soundDesign: `Create a sound design plan with ambience, sound effects grouped by type, music direction, timestamped audio plan, silence moments, voiceover performance notes, and royalty-free search keywords.`,
    continuity: `Act as continuity supervisor. List fixed visual/story rules, 20 possible production mistakes with fixes, AI generation warnings, and final checklist.`
  };

  return `${base}

TASK
${tasks[tool] || tasks.full}`;
}
