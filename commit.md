This is for the comment structure of the commit only

Be Brief

NEVER REFERENCE CLAUDE or CLAUDE CODE in the commit comments

keep it high-level, examples: "update: overhauled chat ui, adjusted input and output workflows, design system tweaks"

example what NOT TO DO, this is bad:
 git add src/app/void/llmClient.ts && git commit -m "update: integrate cloud LLM API with OpenAI-compatible format

   🤖 Generated with [Claude Code](https://claude.com/claude-code)

   Co-Authored-By: Claude <noreply@anthropic.com>"
   Commit LLM client changes


example what WHAT TO DO: 
   git add src/app/void/llmClient.ts && git commit -m "update: integrate cloud LLM API with OpenAI-compatible format"




After a commit has been confirmed and pushed with the correct comment, quickly generate a update file in the /updates folder, read the session with the latest date to see structure