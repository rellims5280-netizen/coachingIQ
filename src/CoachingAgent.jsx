import { useState, useEffect, useRef } from "react";

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink: #0f0e0d;
    --paper: #f5f2ee;
    --cream: #ede9e3;
    --accent: #c84b31;
    --accent2: #2d6a4f;
    --muted: #8a8278;
    --border: #d4cfc9;
    --card: #ffffff;
  }

  body { font-family: 'DM Sans', sans-serif; background: var(--paper); color: var(--ink); }

  .app {
    min-height: 100vh;
    display: grid;
    grid-template-rows: auto 1fr;
  }

  header {
    border-bottom: 2px solid var(--ink);
    padding: 18px 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--ink);
    color: var(--paper);
  }

  .logo {
    font-family: 'DM Serif Display', serif;
    font-size: 1.5rem;
    letter-spacing: -0.5px;
  }
  .logo span { color: var(--accent); font-style: italic; }

  .tagline { font-size: 0.75rem; color: #a09890; font-family: 'DM Mono', monospace; letter-spacing: 1px; text-transform: uppercase; }

  .main { display: grid; grid-template-columns: 1fr 1fr; height: calc(100vh - 65px); }

  /* LEFT PANEL */
  .left-panel { border-right: 2px solid var(--ink); display: flex; flex-direction: column; overflow: hidden; }

  .panel-header {
    padding: 16px 24px;
    border-bottom: 1.5px solid var(--border);
    display: flex; align-items: center; gap: 12px;
    background: var(--cream);
  }
  .panel-title { font-family: 'DM Serif Display', serif; font-size: 1.1rem; }
  .badge {
    background: var(--ink); color: var(--paper);
    font-family: 'DM Mono', monospace; font-size: 0.6rem;
    padding: 3px 8px; letter-spacing: 1px; text-transform: uppercase;
  }

  .rep-select-row {
    padding: 14px 24px;
    border-bottom: 1.5px solid var(--border);
    display: flex; align-items: center; gap: 12px;
    background: var(--paper);
  }
  .rep-select-row label { font-size: 0.78rem; color: var(--muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; }
  .rep-input {
    flex: 1;
    border: 1.5px solid var(--border); background: white;
    padding: 7px 12px; font-family: 'DM Sans', sans-serif; font-size: 0.9rem;
    outline: none; transition: border 0.15s;
  }
  .rep-input:focus { border-color: var(--ink); }

  textarea.transcript-box {
    flex: 1;
    width: 100%;
    border: none;
    padding: 24px;
    font-family: 'DM Mono', monospace;
    font-size: 0.82rem;
    line-height: 1.7;
    resize: none;
    background: white;
    color: var(--ink);
    outline: none;
  }
  textarea.transcript-box::placeholder { color: #c0bbb5; }

  .analyze-btn {
    margin: 16px 24px;
    background: var(--accent);
    color: white;
    border: none;
    padding: 13px 24px;
    font-family: 'DM Serif Display', serif;
    font-size: 1rem;
    cursor: pointer;
    letter-spacing: 0.3px;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    transition: background 0.15s, transform 0.1s;
  }
  .analyze-btn:hover:not(:disabled) { background: #a83a22; transform: translateY(-1px); }
  .analyze-btn:disabled { background: var(--muted); cursor: not-allowed; }

  .btn-row { display: flex; gap: 10px; margin: 16px 24px; }
  .btn-row .analyze-btn { flex: 1; margin: 0; }
  .next-call-btn {
    flex: 1;
    background: var(--ink);
    color: var(--paper);
    border: none;
    padding: 13px 16px;
    font-family: 'DM Serif Display', serif;
    font-size: 1rem;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: background 0.15s, transform 0.1s;
  }
  .next-call-btn:hover:not(:disabled) { background: #333; transform: translateY(-1px); }
  .next-call-btn:disabled { background: var(--muted); cursor: not-allowed; }

  /* RIGHT PANEL */
  .right-panel { display: flex; flex-direction: column; overflow: hidden; }

  .tabs {
    display: flex;
    border-bottom: 2px solid var(--ink);
    background: var(--cream);
  }
  .tab {
    flex: 1;
    padding: 13px 8px;
    font-size: 0.75rem;
    font-family: 'DM Mono', monospace;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    cursor: pointer;
    border: none;
    background: transparent;
    color: var(--muted);
    border-right: 1.5px solid var(--border);
    transition: background 0.15s, color 0.15s;
  }
  .tab:last-child { border-right: none; }
  .tab.active { background: var(--ink); color: var(--paper); }
  .tab:hover:not(.active) { background: var(--border); color: var(--ink); }

  .tab-content { flex: 1; overflow-y: auto; padding: 24px; }

  /* COACHING CONTENT */
  .empty-state {
    height: 100%;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 12px; color: var(--muted);
  }
  .empty-icon { font-size: 2.5rem; opacity: 0.4; }
  .empty-label { font-family: 'DM Mono', monospace; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; }

  .loading-state {
    height: 100%;
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px;
  }
  .spinner {
    width: 36px; height: 36px;
    border: 3px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-text { font-family: 'DM Mono', monospace; font-size: 0.75rem; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; }

  /* FEEDBACK CARD */
  .feedback-section { margin-bottom: 24px; }
  .section-label {
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: var(--muted);
    margin-bottom: 10px;
    padding-bottom: 6px;
    border-bottom: 1px solid var(--border);
  }

  .score-row { display: flex; align-items: center; gap: 14px; margin-bottom: 14px; }
  .score-circle {
    width: 56px; height: 56px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-family: 'DM Serif Display', serif;
    font-size: 1.3rem;
    font-weight: bold;
    border: 2.5px solid var(--ink);
    flex-shrink: 0;
  }
  .score-excellent { color: var(--accent2); border-color: var(--accent2); }
  .score-good { color: #d4a017; border-color: #d4a017; }
  .score-poor { color: var(--accent); border-color: var(--accent); }

  .score-details { flex: 1; }
  .score-rep-name { font-family: 'DM Serif Display', serif; font-size: 1.1rem; }
  .score-sub { font-size: 0.78rem; color: var(--muted); margin-top: 2px; }

  .strengths-list, .improvements-list { list-style: none; display: flex; flex-direction: column; gap: 8px; }
  .strength-item, .improvement-item {
    padding: 10px 14px;
    font-size: 0.875rem;
    line-height: 1.5;
    border-left: 3px solid;
  }
  .strength-item { border-color: var(--accent2); background: #f0f7f4; }
  .improvement-item { border-color: var(--accent); background: #fdf4f2; }

  /* CHAT */
  .chat-container { display: flex; flex-direction: column; height: 100%; gap: 0; }
  .chat-messages { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; padding-bottom: 8px; }

  .msg {
    padding: 10px 14px;
    font-size: 0.87rem;
    line-height: 1.55;
    max-width: 88%;
  }
  .msg-assistant {
    background: var(--cream);
    border-left: 3px solid var(--ink);
    align-self: flex-start;
  }
  .msg-user {
    background: var(--ink);
    color: var(--paper);
    align-self: flex-end;
  }

  .chat-input-row {
    display: flex; gap: 8px; margin-top: 12px;
    border-top: 1.5px solid var(--border);
    padding-top: 12px;
  }
  .chat-input {
    flex: 1;
    border: 1.5px solid var(--border);
    padding: 9px 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.875rem;
    outline: none;
    transition: border 0.15s;
  }
  .chat-input:focus { border-color: var(--ink); }
  .send-btn {
    background: var(--ink); color: white; border: none;
    padding: 9px 16px; cursor: pointer;
    font-family: 'DM Mono', monospace; font-size: 0.75rem;
    transition: background 0.15s;
  }
  .send-btn:hover:not(:disabled) { background: #333; }
  .send-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  /* TALK TRACKS */
  .track-card {
    margin-bottom: 16px;
    border: 1.5px solid var(--border);
    overflow: hidden;
  }
  .track-header {
    padding: 10px 14px;
    background: var(--cream);
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 10px;
  }
  .track-type {
    font-family: 'DM Mono', monospace; font-size: 0.65rem;
    text-transform: uppercase; letter-spacing: 1px;
    background: var(--ink); color: var(--paper);
    padding: 2px 8px;
  }
  .track-title { font-size: 0.875rem; font-weight: 600; }
  .track-body { padding: 14px; font-size: 0.85rem; line-height: 1.6; color: #3a3630; }
  .track-example {
    margin-top: 10px; padding: 10px 14px;
    background: #f9f6f2; border-top: 1px dashed var(--border);
    font-family: 'DM Mono', monospace; font-size: 0.78rem; line-height: 1.55;
    color: var(--ink);
  }
  .track-example::before { content: 'üí¨ '; }

  /* PROGRESS */
  .rep-history { }
  .history-item {
    display: flex; gap: 14px; padding: 14px 0;
    border-bottom: 1px solid var(--border);
    align-items: flex-start;
  }
  .history-date { font-family: 'DM Mono', monospace; font-size: 0.7rem; color: var(--muted); min-width: 72px; padding-top: 3px; }
  .history-content { flex: 1; }
  .history-score-row { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
  .history-score {
    font-family: 'DM Serif Display', serif; font-size: 1rem;
    padding: 1px 8px; border: 1.5px solid;
  }
  .history-summary { font-size: 0.82rem; color: var(--muted); line-height: 1.45; }

  .no-history { font-size: 0.85rem; color: var(--muted); font-style: italic; }

  /* NEXT CALL */
  .next-call-header {
    background: var(--ink); color: var(--paper);
    padding: 14px 16px; margin-bottom: 20px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .next-call-title { font-family: 'DM Serif Display', serif; font-size: 1.05rem; }
  .next-call-sub { font-family: 'DM Mono', monospace; font-size: 0.65rem; color: #a09890; text-transform: uppercase; letter-spacing: 1px; margin-top: 3px; }

  .goal-item {
    display: flex; gap: 12px; padding: 12px 14px;
    border: 1.5px solid var(--border); margin-bottom: 10px;
    align-items: flex-start;
  }
  .goal-number {
    font-family: 'DM Serif Display', serif; font-size: 1.2rem;
    color: var(--accent); min-width: 24px; line-height: 1.2;
  }
  .goal-text { font-size: 0.875rem; line-height: 1.55; flex: 1; }
  .goal-metric {
    margin-top: 5px; font-family: 'DM Mono', monospace; font-size: 0.72rem;
    color: var(--accent2); background: #f0f7f4; padding: 2px 8px; display: inline-block;
  }

  .roleplay-box {
    border: 1.5px solid var(--ink); overflow: hidden; margin-bottom: 20px;
  }
  .roleplay-header {
    background: var(--cream); padding: 10px 14px; border-bottom: 1.5px solid var(--border);
    display: flex; align-items: center; gap: 10px;
  }
  .roleplay-tag {
    background: var(--accent2); color: white;
    font-family: 'DM Mono', monospace; font-size: 0.6rem;
    padding: 2px 8px; text-transform: uppercase; letter-spacing: 1px;
  }
  .roleplay-scenario-title { font-size: 0.875rem; font-weight: 600; }
  .roleplay-body { padding: 14px; font-size: 0.875rem; line-height: 1.6; }
  .roleplay-setup {
    background: #f4f1ed; padding: 10px 14px; border-top: 1px dashed var(--border);
    font-family: 'DM Mono', monospace; font-size: 0.78rem; line-height: 1.55;
    color: var(--ink); margin-top: 10px;
  }
  .roleplay-setup::before { content: 'üé≠ Setup: '; font-weight: bold; }

  .focus-chip {
    display: inline-block; padding: 5px 12px; margin: 4px;
    border: 1.5px solid var(--ink); font-size: 0.8rem;
    font-family: 'DM Mono', monospace; background: var(--cream);
  }

  .generate-next-btn {
    width: 100%; background: var(--accent2); color: white; border: none;
    padding: 13px 24px; font-family: 'DM Serif Display', serif; font-size: 1rem;
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px;
    transition: background 0.15s, transform 0.1s; margin-bottom: 20px;
  }
  .generate-next-btn:hover:not(:disabled) { background: #1f4d38; transform: translateY(-1px); }
  .generate-next-btn:disabled { background: var(--muted); cursor: not-allowed; }

  .trend-bar-wrap { margin-bottom: 20px; }
  .trend-label { font-family: 'DM Mono', monospace; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 1px; color: var(--muted); margin-bottom: 8px; }
  .trend-bars { display: flex; align-items: flex-end; gap: 6px; height: 60px; }
  .trend-bar-col { display: flex; flex-direction: column; align-items: center; gap: 4px; flex: 1; }
  .trend-bar {
    width: 100%; background: var(--ink); transition: height 0.3s;
    position: relative;
  }
  .trend-bar-score { font-family: 'DM Mono', monospace; font-size: 0.6rem; color: var(--muted); }

  .chat-notice {
    padding: 10px 14px; background: #fdf4f2; border: 1.5px dashed var(--border);
    font-size: 0.8rem; color: var(--muted); margin-bottom: 12px; line-height: 1.45;
  }

  /* NEXT CALL */
  .next-call-header {
    background: var(--ink); color: var(--paper);
    padding: 16px 18px; margin-bottom: 20px;
    display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;
  }
  .next-call-rep { font-family: 'DM Serif Display', serif; font-size: 1.15rem; }
  .next-call-sub { font-size: 0.75rem; color: #a09890; margin-top: 3px; font-family: 'DM Mono', monospace; }
  .next-call-score-pill {
    background: var(--accent); color: white;
    font-family: 'DM Mono', monospace; font-size: 0.7rem;
    padding: 4px 10px; white-space: nowrap; flex-shrink: 0; margin-top: 2px;
  }

  .focus-area {
    display: flex; gap: 14px; padding: 12px 14px; margin-bottom: 10px;
    border: 1.5px solid var(--border); background: white;
    align-items: flex-start;
  }
  .focus-number {
    width: 28px; height: 28px; flex-shrink: 0;
    background: var(--ink); color: var(--paper);
    display: flex; align-items: center; justify-content: center;
    font-family: 'DM Serif Display', serif; font-size: 0.95rem;
  }
  .focus-content { flex: 1; }
  .focus-title { font-weight: 600; font-size: 0.875rem; margin-bottom: 4px; }
  .focus-desc { font-size: 0.82rem; color: #555; line-height: 1.5; }

  .roleplays { display: flex; flex-direction: column; gap: 10px; }
  .roleplay-card { border: 1.5px solid var(--border); overflow: hidden; }
  .roleplay-scenario {
    padding: 9px 14px; background: var(--cream);
    font-size: 0.75rem; font-family: 'DM Mono', monospace;
    text-transform: uppercase; letter-spacing: 0.8px; color: var(--muted);
    border-bottom: 1px solid var(--border);
  }
  .roleplay-prompt {
    padding: 12px 14px; font-size: 0.855rem; line-height: 1.55; color: var(--ink);
  }
  .roleplay-cue {
    padding: 10px 14px; background: #f9f6f2;
    border-top: 1px dashed var(--border);
    font-size: 0.78rem; color: var(--muted); line-height: 1.45;
  }
  .roleplay-cue strong { color: var(--ink); }

  .checklist { display: flex; flex-direction: column; gap: 6px; }
  .checklist-item {
    display: flex; align-items: flex-start; gap: 10px; padding: 10px 14px;
    border: 1.5px solid var(--border); background: white; cursor: pointer;
    transition: background 0.12s;
  }
  .checklist-item:hover { background: var(--cream); }
  .checklist-item.checked { background: #f0f7f4; border-color: var(--accent2); }
  .check-box {
    width: 18px; height: 18px; flex-shrink: 0; margin-top: 1px;
    border: 2px solid var(--border); display: flex; align-items: center; justify-content: center;
    transition: all 0.12s;
  }
  .checklist-item.checked .check-box { background: var(--accent2); border-color: var(--accent2); color: white; font-size: 0.7rem; }
  .check-text { font-size: 0.865rem; line-height: 1.45; }
  .checklist-item.checked .check-text { text-decoration: line-through; color: var(--muted); }
`;

// ---- Anthropic API call ----
async function callClaude(messages, system, max_tokens = 1000) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens,
      system,
      messages,
    }),
  });
  const data = await res.json();
  return data.content?.map(b => b.text || "").join("") || "";
}

function getScoreClass(s) {
  if (s >= 80) return "score-excellent";
  if (s >= 60) return "score-good";
  return "score-poor";
}

function getScoreColor(s) {
  if (s >= 80) return "var(--accent2)";
  if (s >= 60) return "#d4a017";
  return "var(--accent)";
}

export default function CoachingAgent() {
  const [transcript, setTranscript] = useState("");
  const [repName, setRepName] = useState("");
  const [activeTab, setActiveTab] = useState("feedback");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [nextCall, setNextCall] = useState(null);
  const [nextCallLoading, setNextCallLoading] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});
  const [history, setHistory] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  async function analyze() {
    if (!transcript.trim()) return;
    setLoading(true);
    setResult(null);
    setNextCall(null);
    setCheckedItems({});
    setChatMessages([]);

    const system = `You are an expert phone sales and customer service coaching AI. 
Analyze the given call transcript and return ONLY valid JSON with this exact structure:
{
  "score": <number 0-100>,
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "improvements": ["improvement 1", "improvement 2", "improvement 3"],
  "tracks": [
    { "type": "Rebuttal", "title": "Handling Price Objections", "tip": "short coaching tip", "example": "suggested script line" },
    { "type": "Opener", "title": "Stronger Call Opening", "tip": "short coaching tip", "example": "suggested script line" }
  ]
}
Base the score on: rapport building, active listening, objection handling, call structure, closing skills.
Make strengths specific to the transcript. Make improvements actionable. Suggest 2-3 talk tracks relevant to what happened in the call.`;

    try {
      const raw = await callClaude([{ role: "user", content: `Rep Name: ${repName || "Unknown"}\n\nTranscript:\n${transcript}` }], system);
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      const entry = { ...parsed, repName: repName || "Unknown Rep", date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }), transcript };
      setResult(entry);
      setHistory(prev => [...prev, entry]);
      // Auto-generate next call plan
      generateNextCall(entry);
    } catch (e) {
      console.error("Analysis error:", e.message);
      setResult({ error: true, message: e.message });
    }
    setLoading(false);
  }

  async function generateNextCall(entry) {
    setNextCallLoading(true);
    const system = `You are an expert phone sales coach. Given a rep's call analysis, generate a focused next-call prep plan.
Return ONLY valid JSON:
{
  "focusAreas": [
    { "title": "short title", "description": "1-2 sentence coaching directive specific to what happened" },
    { "title": "...", "description": "..." },
    { "title": "...", "description": "..." }
  ],
  "roleplays": [
    { "scenario": "scenario label", "prompt": "the opening line or situation the manager should role-play as the customer", "cue": "what the manager should watch for / coach toward" },
    { "scenario": "...", "prompt": "...", "cue": "..." }
  ],
  "managerChecklist": [
    "Specific action item for manager before next call",
    "...",
    "...",
    "...",
    "..."
  ]
}
Make everything highly specific to THIS rep's actual performance. No generic advice.`;

    try {
      const prompt = `Rep: ${entry.repName}
Score: ${entry.score}/100
Strengths: ${entry.strengths?.join("; ")}
Improvements needed: ${entry.improvements?.join("; ")}
Transcript excerpt: ${entry.transcript?.slice(0, 800)}`;
      const raw = await callClaude([{ role: "user", content: prompt }], system, 1200);
      const clean = raw.replace(/```json|```/g, "").trim();
      setNextCall(JSON.parse(clean));
    } catch {
      setNextCall({ error: true });
    }
    setNextCallLoading(false);
  }

  async function sendChat() {
    if (!chatInput.trim() || !result) return;
    const userMsg = { role: "user", content: chatInput };
    const newMessages = [...chatMessages, userMsg];
    setChatMessages(newMessages);
    setChatInput("");
    setChatLoading(true);

    const system = `You are an expert phone sales coaching assistant. You have analyzed this call transcript and produced this coaching report:
Score: ${result.score}/100
Strengths: ${result.strengths?.join("; ")}
Areas to improve: ${result.improvements?.join("; ")}

Original transcript:
${result.transcript}

Answer the manager's questions helpfully and concisely. Be specific and reference the transcript when relevant. Keep answers under 150 words.`;

    try {
      const reply = await callClaude(newMessages, system);
      setChatMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setChatMessages(prev => [...prev, { role: "assistant", content: "Sorry, I had trouble responding. Please try again." }]);
    }
    setChatLoading(false);
  }

  const tabs = ["feedback", "tracks", "nextcall", "chat", "progress"];
  const tabLabels = { feedback: "Coaching", tracks: "Talk Tracks", nextcall: "Next Call", chat: "Ask AI", progress: "Progress" };

  return (
    <>
      <style>{STYLE}</style>
      <div className="app">
        <header>
          <div>
            <div className="logo">Coach<span>IQ</span></div>
            <div className="tagline">AI-Powered Rep Coaching</div>
          </div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#a09890", textAlign: "right" }}>
            {history.length} session{history.length !== 1 ? "s" : ""} logged
          </div>
        </header>

        <div className="main">
          {/* LEFT */}
          <div className="left-panel">
            <div className="panel-header">
              <div className="panel-title">Call Transcript</div>
              <div className="badge">Input</div>
            </div>
            <div className="rep-select-row">
              <label>Rep</label>
              <input className="rep-input" placeholder="Rep name..." value={repName} onChange={e => setRepName(e.target.value)} />
            </div>
            <textarea
              className="transcript-box"
              placeholder={"Paste call transcript here...\n\nExample:\nRep: Thank you for calling, this is Alex.\nCustomer: Hi, I'm calling about my account...\nRep: Of course, I'd be happy to help..."}
              value={transcript}
              onChange={e => setTranscript(e.target.value)}
            />
            <div className="btn-row">
              <button className="analyze-btn" onClick={analyze} disabled={loading || !transcript.trim()}>
                {loading ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Analyzing...</> : "‚ñ∂ Analyze Call"}
              </button>
              <button className="next-call-btn" onClick={() => {
                setTranscript("");
                setRepName("");
                setResult(null);
                setNextCall(null);
                setCheckedItems({});
                setChatMessages([]);
                setActiveTab("feedback");
              }} disabled={!result || result.error || loading}>
                {"üìû Next Call"}
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div className="right-panel">
            <div className="tabs">
              {tabs.map(t => (
                <button key={t} className={`tab${activeTab === t ? " active" : ""}`} onClick={() => setActiveTab(t)}>
                  {tabLabels[t]}
                </button>
              ))}
            </div>

            <div className="tab-content">
              {/* FEEDBACK TAB */}
              {activeTab === "feedback" && (
                loading ? (
                  <div className="loading-state">
                    <div className="spinner" />
                    <div className="loading-text">Analyzing call...</div>
                  </div>
                ) : !result ? (
                  <div className="empty-state">
                    <div className="empty-icon">üìã</div>
                    <div className="empty-label">Paste a transcript and analyze to get coaching feedback</div>
                  </div>
                ) : result.error ? (
                  <div className="empty-state"><div className="empty-label" style={{ color: "var(--accent)" }}>Analysis failed: {result.message || "Check console for details."}</div></div>
                ) : (
                  <>
                    <div className="feedback-section">
                      <div className="section-label">Overall Score</div>
                      <div className="score-row">
                        <div className={`score-circle ${getScoreClass(result.score)}`}>{result.score}</div>
                        <div className="score-details">
                          <div className="score-rep-name">{result.repName}</div>
                          <div className="score-sub">{result.score >= 80 ? "Strong performance" : result.score >= 60 ? "Good ‚Äî room to grow" : "Needs focused coaching"} ¬∑ {result.date}</div>
                        </div>
                      </div>
                    </div>

                    <div className="feedback-section">
                      <div className="section-label">Strengths</div>
                      <ul className="strengths-list">
                        {result.strengths?.map((s, i) => <li key={i} className="strength-item">‚úì {s}</li>)}
                      </ul>
                    </div>

                    <div className="feedback-section">
                      <div className="section-label">Areas to Improve</div>
                      <ul className="improvements-list">
                        {result.improvements?.map((s, i) => <li key={i} className="improvement-item">‚Üí {s}</li>)}
                      </ul>
                    </div>
                  </>
                )
              )}

              {/* TALK TRACKS TAB */}
              {activeTab === "tracks" && (
                !result || result.error ? (
                  <div className="empty-state">
                    <div className="empty-icon">üí¨</div>
                    <div className="empty-label">Analyze a call to see suggested talk tracks</div>
                  </div>
                ) : (
                  <>
                    <div className="section-label" style={{ marginBottom: 16 }}>Suggested Talk Tracks</div>
                    {result.tracks?.map((t, i) => (
                      <div key={i} className="track-card">
                        <div className="track-header">
                          <div className="track-type">{t.type}</div>
                          <div className="track-title">{t.title}</div>
                        </div>
                        <div className="track-body">
                          {t.tip}
                          <div className="track-example">{t.example}</div>
                        </div>
                      </div>
                    ))}
                  </>
                )
              )}

              {/* NEXT CALL TAB */}
              {activeTab === "nextcall" && (
                (!result || result.error) ? (
                  <div className="empty-state">
                    <div className="empty-icon">üìû</div>
                    <div className="empty-label">Analyze a call to generate a next-call prep plan</div>
                  </div>
                ) : nextCallLoading ? (
                  <div className="loading-state">
                    <div className="spinner" />
                    <div className="loading-text">Building next call plan...</div>
                  </div>
                ) : nextCall?.error ? (
                  <div className="empty-state"><div className="empty-label" style={{ color: "var(--accent)" }}>Failed to generate plan. Please try again.</div></div>
                ) : nextCall ? (
                  <>
                    <div className="next-call-header">
                      <div>
                        <div className="next-call-rep">Next Call Prep ‚Äî {result.repName}</div>
                        <div className="next-call-sub">Based on call scored {result.score}/100 ¬∑ {result.date}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                        <div className="next-call-score-pill">
                          {result.score >= 80 ? "MAINTAIN" : result.score >= 60 ? "IMPROVE" : "URGENT"}
                        </div>
                        <button
                          onClick={() => {
                            setTranscript("");
                            setRepName("");
                            setResult(null);
                            setNextCall(null);
                            setCheckedItems({});
                            setChatMessages([]);
                            setActiveTab("feedback");
                          }}
                          style={{
                            background: "transparent", border: "1.5px solid #a09890", color: "#a09890",
                            padding: "4px 10px", cursor: "pointer", fontFamily: "'DM Mono', monospace",
                            fontSize: "0.65rem", letterSpacing: "0.8px", textTransform: "uppercase",
                            transition: "all 0.15s", whiteSpace: "nowrap"
                          }}
                          onMouseEnter={e => { e.target.style.borderColor = "white"; e.target.style.color = "white"; }}
                          onMouseLeave={e => { e.target.style.borderColor = "#a09890"; e.target.style.color = "#a09890"; }}
                        >
                          + New Transcript
                        </button>
                      </div>
                    </div>

                    <div className="feedback-section">
                      <div className="section-label">Focus Areas for Next Call</div>
                      {nextCall.focusAreas?.map((fa, i) => (
                        <div key={i} className="focus-area">
                          <div className="focus-number">{i + 1}</div>
                          <div className="focus-content">
                            <div className="focus-title">{fa.title}</div>
                            <div className="focus-desc">{fa.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="feedback-section">
                      <div className="section-label">Role-Play Scenarios</div>
                      <div className="roleplays">
                        {nextCall.roleplays?.map((rp, i) => (
                          <div key={i} className="roleplay-card">
                            <div className="roleplay-scenario">{rp.scenario}</div>
                            <div className="roleplay-prompt">"{rp.prompt}"</div>
                            <div className="roleplay-cue"><strong>Coach for:</strong> {rp.cue}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="feedback-section">
                      <div className="section-label">Manager Checklist ‚Äî Before Next Call</div>
                      <div className="checklist">
                        {nextCall.managerChecklist?.map((item, i) => {
                          const key = `check-${i}`;
                          return (
                            <div
                              key={i}
                              className={`checklist-item${checkedItems[key] ? " checked" : ""}`}
                              onClick={() => setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }))}
                            >
                              <div className="check-box">{checkedItems[key] ? "‚úì" : ""}</div>
                              <div className="check-text">{item}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                ) : null
              )}

              {/* CHAT TAB */}
              {activeTab === "chat" && (
                !result || result.error ? (
                  <div className="empty-state">
                    <div className="empty-icon">ü§ñ</div>
                    <div className="empty-label">Analyze a call first, then ask follow-up questions</div>
                  </div>
                ) : (
                  <div className="chat-container">
                    <div className="chat-notice">Ask anything about this call ‚Äî "What should I role-play with this rep?" or "Why did they lose the customer?"</div>
                    <div className="chat-messages">
                      {chatMessages.length === 0 && (
                        <div className="msg msg-assistant">
                          I've finished analyzing {result.repName}'s call (score: {result.score}/100). What would you like to explore or coach on?
                        </div>
                      )}
                      {chatMessages.map((m, i) => (
                        <div key={i} className={`msg msg-${m.role}`}>{m.content}</div>
                      ))}
                      {chatLoading && <div className="msg msg-assistant" style={{ color: "var(--muted)" }}>Thinking...</div>}
                      <div ref={chatEndRef} />
                    </div>
                    <div className="chat-input-row">
                      <input
                        className="chat-input"
                        placeholder="Ask about this call..."
                        value={chatInput}
                        onChange={e => setChatInput(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && !chatLoading && sendChat()}
                        disabled={chatLoading}
                      />
                      <button className="send-btn" onClick={sendChat} disabled={chatLoading || !chatInput.trim()}>Send</button>
                    </div>
                  </div>
                )
              )}

              {/* PROGRESS TAB */}
              {activeTab === "progress" && (
                history.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">üìà</div>
                    <div className="empty-label">Analyze multiple calls to track rep progress</div>
                  </div>
                ) : (
                  <>
                    {/* Mini trend chart */}
                    {history.length > 1 && (
                      <div className="trend-bar-wrap">
                        <div className="trend-label">Score Trend (last {history.length} sessions)</div>
                        <div className="trend-bars">
                          {history.map((h, i) => {
                            const pct = (h.score / 100) * 60;
                            return (
                              <div key={i} className="trend-bar-col">
                                <div className="trend-bar" style={{ height: `${pct}px`, background: getScoreColor(h.score) }} />
                                <div className="trend-bar-score">{h.score}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div className="section-label" style={{ marginBottom: 4 }}>Session History</div>
                    <div className="rep-history">
                      {[...history].reverse().map((h, i) => (
                        <div key={i} className="history-item">
                          <div className="history-date">{h.date}</div>
                          <div className="history-content">
                            <div className="history-score-row">
                              <div className="history-score" style={{ color: getScoreColor(h.score), borderColor: getScoreColor(h.score) }}>{h.score}</div>
                              <strong style={{ fontSize: "0.875rem" }}>{h.repName}</strong>
                            </div>
                            <div className="history-summary">{h.improvements?.[0]}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

