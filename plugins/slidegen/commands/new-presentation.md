# /new-presentation

Create a new presentation using the optimal template-based workflow with automatic export and browser-based review. Supports both Marp and Slidev presentation libraries.

The command expects arguments in this format: `topic [template-type] [audience] [slidecount] [includeWebSearch] [includeInteractive] [library]`

**Arguments for $ARGUMENTS:**
- Position 1: `topic` (required): The main subject or title of your presentation
- Position 2: `template-type` (optional): `basic`, `tech`, or `corporate` (defaults to `basic`)
- Position 3: `audience` (optional): Target audience description for tailored content
- Position 4: `slidecount` (optional): The number of slides to generate
- Position 5: `includeWebSearch` (optional): If set to `true`, includes web search for additional content (default is `false`)
- Position 6: `includeInteractive` (optional): If set to `true`, adds interactive elements like polls, quizzes, and animations (default is `false`)
- Position 7: `library` (optional): `marp` or `slidev` (defaults to `marp`)


## Workflow

The command follows this sequence:
1. Determine target filename from topic
2. Copy appropriate template file from `templates/[library]/` folder to `output/` folder
3. (Optional) **Use web-researcher**: If web search is enabled, use the `web-researcher` agent to gather additional content regarding the $ARGUMENTS topic
4. **Use slide-architect**: "Plan $ARGUMENTS presentation using [template-type from $ARGUMENTS] template"
5. (Optional) **Use interactive-elements**: If interactive elements are enabled, use the `interactive-elements` agent to add engagement features
6. **Use library-specific formatter**: 
   - For Marp library: Use `marp-formatter`
   - For Slidev library: Use `slidev-formatter`
7. **Use content-reviewer**: Review the presentation for consistency and quality
8. Save the completed presentation file in `output/` folder

**Note**: The library-specific formatters handle all export commands and library-specific syntax automatically. Other agents remain library-agnostic.

Create a new presentation about $ARGUMENTS using the specialized agents workflow. Parse the arguments to determine topic, template type, audience, slide count, web search inclusion, interactive elements, and presentation library.

