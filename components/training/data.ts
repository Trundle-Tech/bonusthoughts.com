export const aiTools = [
  {
    name: "Claude",
    company: "Anthropic",
    bestFor: ["Long-form writing", "Code analysis", "Complex reasoning", "Document review"],
    models: ["Claude Opus 4.5 (flagship)", "Claude Sonnet 4.5 (fast + capable)", "Claude Haiku (speed)"],
    pricing: "Free tier available, Pro $20/mo",
    color: "cyan-400"
  },
  {
    name: "ChatGPT",
    company: "OpenAI",
    bestFor: ["General tasks", "Creative writing", "Image generation", "Voice conversations"],
    models: ["GPT-5.2 (latest)", "GPT-4o (multimodal)", "GPT-4o mini (fast)"],
    pricing: "Free tier available, Plus $20/mo",
    color: "[#4a7c59]"
  },
  {
    name: "Gemini",
    company: "Google",
    bestFor: ["Google Workspace integration", "Research", "Multimodal tasks", "Long context (1M tokens)"],
    models: ["Gemini 3 Pro (flagship)", "Gemini 2.5 Flash (fast)", "Gemini in Workspace"],
    pricing: "Free tier available, Advanced $20/mo",
    color: "[#5a8a65]"
  },
  {
    name: "Grok",
    company: "xAI",
    bestFor: ["Real-time information", "X/Twitter integration", "Unfiltered responses", "Current events"],
    models: ["Grok 4.1 (latest)", "Grok Vision"],
    pricing: "X Premium+ required ($16/mo)",
    color: "[#D4C4B0]"
  },
];

export const aiIDEs = [
  {
    name: "Claude Code",
    company: "Anthropic",
    description: "Agentic coding tool that lives in your terminal—understands your codebase, executes tasks, handles git workflows through natural language",
    features: ["CLI + VS Code + JetBrains", "Multi-file edits", "Git integration", "CLAUDE.md project context"],
    pricing: "Requires Claude Pro/Max/Teams ($20-100/mo)",
    bestFor: "Developers who want AI that truly understands their entire codebase",
    color: "cyan-400"
  },
  {
    name: "Claude Cowork",
    company: "Anthropic",
    description: "Desktop agent for non-developers—'Claude Code for the rest of your work.' Reads, edits, and creates files in your local folders. Built primarily by Claude Code itself.",
    features: ["Local file access", "Excel/PowerPoint/Word/PDF", "Sub-agent coordination", "Browser integration via Chrome"],
    pricing: "Requires Claude Pro/Max/Teams ($20-100/mo)",
    bestFor: "Knowledge workers who want AI to handle documents, spreadsheets, and file organization",
    color: "cyan-400"
  },
  {
    name: "Cursor",
    company: "Cursor Inc.",
    description: "AI-first IDE built on VS Code with Background Agents, BugBot for PR reviews, and persistent Memories across sessions",
    features: ["Background Agents", "BugBot PR reviews", "Visual Editor", "Multi-model support"],
    pricing: "Free tier, Pro $20/mo, Ultra $200/mo",
    bestFor: "Teams wanting full AI IDE experience with agentic workflows",
    color: "[#4a7c59]"
  },
  {
    name: "Windsurf",
    company: "Codeium",
    description: "Agentic IDE with Cascade system—Write, Chat, and Turbo modes for different coding workflows",
    features: ["Cascade AI system", "Turbo autonomous mode", "70+ language support", "Free tier available"],
    pricing: "Free with SWE-1 Lite, Pro for full access",
    bestFor: "Developers new to AI coding tools—generous free tier, intuitive interface",
    color: "[#5a8a65]"
  },
  {
    name: "Google Antigravity",
    company: "Google",
    description: "Agent-first IDE with Editor and Manager views—orchestrate multiple AI agents working in parallel across workspaces",
    features: ["Editor + Manager views", "Multi-agent orchestration", "Gemini 3 powered", "Artifacts system"],
    pricing: "Free in public preview",
    bestFor: "Complex projects needing parallel agent workflows",
    color: "[#D4C4B0]"
  },
];

export const enterpriseTools = [
  {
    name: "Microsoft Copilot",
    description: "AI integrated into Word, Excel, PowerPoint, Outlook, and Teams",
    useCases: ["Summarize meetings", "Draft emails", "Analyze spreadsheets", "Create presentations"],
    pricing: "$30/user/month (on top of M365)",
    tip: "Best ROI for teams already using Microsoft 365 heavily"
  },
  {
    name: "Perplexity",
    description: "AI-powered research engine with citations",
    useCases: ["Research with sources", "Fact-checking", "Competitive analysis", "Market research"],
    pricing: "Free tier, Pro $20/mo",
    tip: "Replaced Google for many knowledge workers—answers come with citations"
  },
  {
    name: "GitHub Copilot",
    description: "AI pair programmer in your IDE",
    useCases: ["Code completion", "Generate functions", "Write tests", "Explain code"],
    pricing: "$10/mo individual, $19/mo business",
    tip: "Works with VS Code, JetBrains, Neovim—uses Claude Sonnet 4.5 or GPT under the hood"
  },
];

export const useCaseMatrix = [
  { task: "Write a report or document", recommended: "Claude", runner: "ChatGPT", reason: "Claude excels at long-form, structured writing" },
  { task: "Analyze a spreadsheet", recommended: "Copilot", runner: "ChatGPT", reason: "Native Excel integration beats copy-pasting" },
  { task: "Research a topic with sources", recommended: "Perplexity", runner: "Gemini", reason: "Built-in citations and real-time web access" },
  { task: "Debug code", recommended: "Claude Code", runner: "Cursor", reason: "Understands full codebase context, can execute fixes" },
  { task: "Build a new feature", recommended: "Cursor", runner: "Claude Code", reason: "Background agents + visual editor for rapid development" },
  { task: "Refactor across files", recommended: "Claude Code", runner: "Windsurf", reason: "Multi-file edits with full project understanding" },
  { task: "Organize files & documents", recommended: "Claude Cowork", runner: "Copilot", reason: "Direct local file access, creates proper Excel/Word/PPT" },
  { task: "Process receipts/invoices", recommended: "Claude Cowork", runner: "ChatGPT", reason: "Reads files, outputs formatted spreadsheets with formulas" },
  { task: "Summarize a meeting", recommended: "Copilot", runner: "Claude", reason: "Native Teams integration captures everything" },
  { task: "Generate images", recommended: "Midjourney", runner: "ChatGPT (DALL-E)", reason: "Midjourney v7 has best quality; ChatGPT is more convenient" },
  { task: "Quick questions", recommended: "ChatGPT", runner: "Claude", reason: "Fastest response times, good free tier" },
  { task: "Legal/compliance review", recommended: "Claude", runner: "ChatGPT", reason: "Best at careful, nuanced analysis" },
  { task: "Complex multi-agent coding", recommended: "Antigravity", runner: "Cursor", reason: "Manager view orchestrates parallel agent workflows" },
];

export const promptTemplates = [
  {
    title: "Analysis Framework",
    template: `I need you to analyze [TOPIC/DOCUMENT].

Please structure your analysis as:
1. Executive Summary (3 sentences max)
2. Key Findings (bullet points)
3. Risks/Concerns
4. Recommendations
5. Next Steps

Be specific and actionable. Flag anything that needs human review.`,
    useFor: "Reports, document review, strategic analysis"
  },
  {
    title: "Email Drafting",
    template: `Write an email with these parameters:
- To: [RECIPIENT + their role]
- Purpose: [WHAT YOU WANT]
- Tone: [professional/friendly/urgent]
- Key points to include: [LIST]
- Constraints: [word limit, what to avoid]

Draft 2 versions: one concise, one detailed.`,
    useFor: "Professional communication, outreach"
  },
  {
    title: "Code Review",
    template: `Review this code for:
1. Bugs or logic errors
2. Security vulnerabilities
3. Performance issues
4. Readability improvements

For each issue found:
- Severity (critical/medium/low)
- Line number
- What's wrong
- How to fix it

[PASTE CODE]`,
    useFor: "Development, code quality"
  },
  {
    title: "Meeting Prep",
    template: `I have a meeting about [TOPIC] with [ATTENDEES].

Help me prepare:
1. What questions should I anticipate?
2. What data/examples should I have ready?
3. What are the likely objections and how do I address them?
4. What's my ideal outcome and how do I steer toward it?

Context: [BACKGROUND]`,
    useFor: "Sales calls, presentations, negotiations"
  },
];

export const setupChecklistItems = [
  { title: "Define use cases first", desc: "Don't just buy licenses—identify 3-5 specific workflows you want to improve" },
  { title: "Start with a pilot group", desc: "10-20 power users who will actually use it daily and give feedback" },
  { title: "Create usage guidelines", desc: "What's OK to put into AI tools? What's not? Make it clear." },
  { title: "Set up SSO/enterprise accounts", desc: "Consumer accounts don't have admin controls or data protection" },
  { title: "Train, don't just deploy", desc: "2-hour training session = 10x more adoption than just sending login links" },
  { title: "Measure what matters", desc: "Time saved, quality improvements, adoption rate. Pick 2-3 metrics." },
  { title: "Plan for ongoing support", desc: "These tools update constantly. Someone needs to stay current and share tips." },
];
