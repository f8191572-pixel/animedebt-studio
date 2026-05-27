"use client";

import { useEffect, useMemo, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabaseClient";
import { buildProjectSummary, buildPromptByTool, getToolTitle } from "@/lib/prompts";

const initialProject = {
  title: "",
  storyIdea: "",
  genre: "Dark fantasy mystery",
  style: "",
  targetFormat: "Trailer",
  platform: "YouTube Shorts",
  length: "60 seconds",
  tone: "",
  mainCharacter: "",
  mainMystery: "",
  worldRules: "",
  avoid: "",
  templateType: "anime-trailer"
};

const demoProject = {
  title: "Clockworld Kingdom",
  storyIdea:
    "A clockwork kingdom called Aurelis where the sun never rises. Every clock in the city obeys the Crown, until one child sees the Grand Clock Tower move backward to 11:59 and discovers that the morning was stolen.",
  genre: "Dark fantasy mystery",
  style:
    "Cinematic anime, dark blue and violet night palette, high contrast, wet cobblestones, fog, steam, glowing cyan clocklight",
  targetFormat: "Trailer",
  platform: "YouTube Shorts",
  length: "60 seconds",
  tone: "Serious, mysterious, epic, tense, emotional",
  mainCharacter: "A quiet child who notices impossible changes in the clocks while everyone else obeys the bells",
  mainMystery: "Who stole the morning, and why does the Crown forbid people from saying sunrise?",
  worldRules:
    "Aurelis is night-only. No true sunlight outdoors. The city runs on bells, shifts, clocks, steam trains, guards, and strict schedules.",
  avoid:
    "No golden sunlight outdoors, no comedy tone, no modern cars, no sci-fi laser guns, no empty streets",
  templateType: "anime-trailer"
};

export default function HomePage() {
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const [session, setSession] = useState(null);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [project, setProject] = useState(initialProject);
  const [projects, setProjects] = useState([]);
  const [selectedTool, setSelectedTool] = useState("full");
  const [result, setResult] = useState("");
  const [prompt, setPrompt] = useState("");
  const [summary, setSummary] = useState("");
  const [jsonView, setJsonView] = useState("");
  const [activeTab, setActiveTab] = useState("result");
  const [status, setStatus] = useState("Ready");
  const [loading, setLoading] = useState(false);
  const [useUserKey, setUseUserKey] = useState(false);
  const [userApiKey, setUserApiKey] = useState("");
  const [model, setModel] = useState("gemini-3.5-flash");
  const [currentProjectId, setCurrentProjectId] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });
    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    if (session) loadProjects();
    else setProjects([]);
  }, [session]);

  const readiness = Math.round(
    [
      project.title,
      project.storyIdea,
      project.genre,
      project.style,
      project.targetFormat,
      project.platform,
      project.length,
      project.tone,
      project.mainCharacter,
      project.mainMystery,
      project.worldRules,
      project.avoid
    ].filter((item) => item && item.length >= 3).length / 12 * 100
  );

  function updateField(field, value) {
    setProject((prev) => ({ ...prev, [field]: value }));
    if (currentProjectId) setStatus("Unsaved edits");
  }

  async function signUp() {
    setAuthMessage("");
    const { error } = await supabase.auth.signUp({ email: authEmail, password: authPassword });
    setAuthMessage(error ? error.message : "Signup created. Check email confirmation if Supabase requires it.");
  }

  async function signIn() {
    setAuthMessage("");
    const { error } = await supabase.auth.signInWithPassword({ email: authEmail, password: authPassword });
    setAuthMessage(error ? error.message : "Signed in.");
  }

  async function signOut() {
    await supabase.auth.signOut();
    setCurrentProjectId(null);
    setResult("");
    setPrompt("");
    setSummary("");
    setJsonView("");
  }

  async function loadProjects() {
    if (!session) return;
    const { data, error } = await supabase
      .from("projects")
      .select("id,title,story_idea,project_data,outputs,updated_at,created_at")
      .order("updated_at", { ascending: false });

    if (error) {
      setStatus(error.message);
      return;
    }

    setProjects(data || []);
  }

  async function saveProject() {
    if (!session) {
      setStatus("Sign in before saving projects.");
      return;
    }
    if (!project.storyIdea || project.storyIdea.length < 8) {
      setStatus("Add a clearer story idea first.");
      return;
    }

    const payload = {
      user_id: session.user.id,
      title: project.title || "Untitled project",
      story_idea: project.storyIdea,
      project_data: project,
      outputs: { result, prompt, summary, jsonView, selectedTool, model }
    };

    const query = currentProjectId
      ? supabase.from("projects").update(payload).eq("id", currentProjectId).select().single()
      : supabase.from("projects").insert(payload).select().single();

    const { data, error } = await query;

    if (error) {
      setStatus(error.message);
      return;
    }

    setCurrentProjectId(data.id);
    setStatus("Saved to Supabase.");
    await loadProjects();
  }

  async function deleteProject(id) {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) {
      setStatus(error.message);
      return;
    }
    if (currentProjectId === id) setCurrentProjectId(null);
    setStatus("Project deleted.");
    await loadProjects();
  }

  function loadProject(savedProject) {
    setProject(savedProject.project_data || initialProject);
    setCurrentProjectId(savedProject.id);
    setResult(savedProject.outputs?.result || "");
    setPrompt(savedProject.outputs?.prompt || "");
    setSummary(savedProject.outputs?.summary || "");
    setJsonView(savedProject.outputs?.jsonView || "");
    setSelectedTool(savedProject.outputs?.selectedTool || "full");
    setActiveTab("summary");
    setStatus("Project loaded.");
    document.getElementById("generator")?.scrollIntoView({ behavior: "smooth" });
  }

  async function generate() {
    if (!project.storyIdea || project.storyIdea.length < 8) {
      setStatus("Add a clearer story idea first.");
      return;
    }

    if (!session) {
      setStatus("Sign in before generating with the backend.");
      return;
    }

    const builtPrompt = buildPromptByTool(selectedTool, project);
    const builtSummary = buildProjectSummary(project);

    setPrompt(builtPrompt);
    setSummary(builtSummary);
    setResult("");
    setActiveTab("result");
    setLoading(true);
    setStatus("Generating...");

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          prompt: builtPrompt,
          model,
          userApiKey: useUserKey ? userApiKey : ""
        })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Generation failed.");

      const outputJson = JSON.stringify(
        {
          generatedAt: data.generatedAt,
          tool: selectedTool,
          toolTitle: getToolTitle(selectedTool),
          model: data.model,
          project,
          prompt: builtPrompt,
          result: data.text
        },
        null,
        2
      );

      setResult(data.text);
      setJsonView(outputJson);
      setStatus("Generated.");
    } catch (error) {
      setResult(error.message);
      setStatus("Error.");
    } finally {
      setLoading(false);
    }
  }

  function copyOutput() {
    const value = activeTab === "result" ? result : activeTab === "prompt" ? prompt : activeTab === "summary" ? summary : jsonView;
    navigator.clipboard.writeText(value || "");
    setStatus("Copied.");
  }

  const shownOutput = activeTab === "result" ? result : activeTab === "prompt" ? prompt : activeTab === "summary" ? summary : jsonView;

  return (
    <main>
      <section className="hero">
        <div>
          <p className="eyebrow">AnimeDebt Studio</p>
          <h1>Story-to-production system for AI anime creators.</h1>
          <p className="lead">
            Vercel runs the app and backend API. Supabase stores users and projects. Gemini generates the production packs.
          </p>
          <a href="#generator" className="button primary">Open Generator</a>
        </div>

        <div className="heroCard">
          <span>Backend architecture</span>
          <strong>Vercel Functions → Gemini</strong>
          <p>Supabase Auth + Postgres stores user accounts and project data.</p>
        </div>
      </section>

      <section className="auth panel">
        <div>
          <p className="eyebrow">Account</p>
          <h2>{session ? "Signed in" : "Sign in or create account"}</h2>
          {session ? <p>{session.user.email}</p> : <p>Use Supabase Auth. Projects save to your Supabase database.</p>}
        </div>

        {!session ? (
          <div className="authGrid">
            <input placeholder="Email" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} />
            <input placeholder="Password" type="password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} />
            <button onClick={signIn}>Sign in</button>
            <button onClick={signUp}>Sign up</button>
            <p>{authMessage}</p>
          </div>
        ) : (
          <button onClick={signOut}>Sign out</button>
        )}
      </section>

      <section className="workspace" id="generator">
        <div className="panel">
          <div className="panelHeader">
            <div>
              <p className="eyebrow">Project setup</p>
              <h2>Generator</h2>
            </div>
            <div className="status">{status}</div>
          </div>

          <div className="quality">
            <span>Project readiness: {readiness}%</span>
            <div><i style={{ width: `${readiness}%` }} /></div>
          </div>

          <div className="formGrid">
            <label>Project title<input value={project.title} onChange={(e) => updateField("title", e.target.value)} /></label>
            <label>Genre<select value={project.genre} onChange={(e) => updateField("genre", e.target.value)}><option>Dark fantasy mystery</option><option>Cyberpunk rebellion</option><option>School anime drama</option><option>Horror mystery</option><option>Adventure fantasy</option><option>Sci-fi thriller</option></select></label>
            <label className="wide">Story idea<textarea rows="4" value={project.storyIdea} onChange={(e) => updateField("storyIdea", e.target.value)} /></label>
            <label>Style<input value={project.style} onChange={(e) => updateField("style", e.target.value)} /></label>
            <label>Format<select value={project.targetFormat} onChange={(e) => updateField("targetFormat", e.target.value)}><option>Trailer</option><option>Episode 1</option><option>YouTube Short</option><option>Character reveal</option><option>Short film</option></select></label>
            <label>Platform<select value={project.platform} onChange={(e) => updateField("platform", e.target.value)}><option>YouTube Shorts</option><option>TikTok</option><option>YouTube long-form</option><option>Instagram Reels</option><option>Anime pilot</option></select></label>
            <label>Length<select value={project.length} onChange={(e) => updateField("length", e.target.value)}><option>30 seconds</option><option>45 seconds</option><option>60 seconds</option><option>90 seconds</option><option>2 minutes</option></select></label>
            <label>Tone<input value={project.tone} onChange={(e) => updateField("tone", e.target.value)} /></label>
            <label>Main character<input value={project.mainCharacter} onChange={(e) => updateField("mainCharacter", e.target.value)} /></label>
            <label>Main mystery<input value={project.mainMystery} onChange={(e) => updateField("mainMystery", e.target.value)} /></label>
            <label className="wide">World rules<textarea rows="3" value={project.worldRules} onChange={(e) => updateField("worldRules", e.target.value)} /></label>
            <label className="wide">Avoid list<textarea rows="3" value={project.avoid} onChange={(e) => updateField("avoid", e.target.value)} /></label>
          </div>

          <div className="row">
            <button onClick={() => { setProject(demoProject); setCurrentProjectId(null); }}>Load demo</button>
            <button onClick={saveProject}>Save to Supabase</button>
            <button onClick={() => { setProject(initialProject); setCurrentProjectId(null); }}>Clear</button>
          </div>
        </div>

        <div className="panel output">
          <p className="eyebrow">Production modules</p>
          <select value={selectedTool} onChange={(e) => setSelectedTool(e.target.value)}>
            <option value="full">Full Production Pack</option>
            <option value="storyDebts">Story Debts</option>
            <option value="trailer">Trailer Script</option>
            <option value="storyboard">Storyboard</option>
            <option value="imagePrompts">Image Prompts</option>
            <option value="videoPrompts">Video Prompts</option>
            <option value="soundDesign">Sound Design</option>
            <option value="continuity">Continuity Check</option>
          </select>

          <label>Gemini model<select value={model} onChange={(e) => setModel(e.target.value)}><option value="gemini-3.5-flash">gemini-3.5-flash</option><option value="gemini-3.5-pro">gemini-3.5-pro</option><option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite</option></select></label>

          <label className="check"><input type="checkbox" checked={useUserKey} onChange={(e) => setUseUserKey(e.target.checked)} /> Use my own Gemini key for this request</label>
          {useUserKey && <input type="password" placeholder="Gemini API key, not stored" value={userApiKey} onChange={(e) => setUserApiKey(e.target.value)} />}

          <button className="primary" disabled={loading} onClick={generate}>{loading ? "Generating..." : "Generate with Backend"}</button>

          <div className="tabs">
            {["result", "prompt", "summary", "json"].map((tab) => <button key={tab} className={activeTab === tab ? "active" : ""} onClick={() => setActiveTab(tab)}>{tab}</button>)}
          </div>

          <pre>{shownOutput || "Output appears here."}</pre>
          <button onClick={copyOutput}>Copy current tab</button>
        </div>
      </section>

      <section className="panel">
        <div className="panelHeader">
          <div>
            <p className="eyebrow">Supabase projects</p>
            <h2>Saved library</h2>
          </div>
          <button onClick={loadProjects}>Refresh</button>
        </div>

        <div className="projectList">
          {projects.length === 0 ? <p>No saved projects yet.</p> : projects.map((item) => (
            <article key={item.id} className={item.id === currentProjectId ? "activeProject" : ""}>
              <div>
                <h3>{item.title}</h3>
                <p>{item.story_idea}</p>
              </div>
              <div>
                <button onClick={() => loadProject(item)}>Load</button>
                <button onClick={() => deleteProject(item.id)}>Delete</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
