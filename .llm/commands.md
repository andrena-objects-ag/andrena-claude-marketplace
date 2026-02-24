# LLM Workflow Commands

Repeatable workflows for agents to execute. Run these by telling Claude Code the command name.

---

## /recent-features [timeframe|afterDate] [referenceHints]

- websearch for claude code features since the provided date or within the provided timeframe 
- if provided use the reference hints for grounding the information
- by default use 3 parallel subagents