# Run Claude Code programmatically

> Use the Agent SDK to run Claude Code programmatically from the CLI, Python, or TypeScript.

The Agent SDK gives you the same tools, agent loop, and context management that power Claude Code. It's available as a CLI for scripts and CI/CD, or as Python and TypeScript packages for full programmatic control.

To run Claude Code programmatically from the CLI, pass `-p` with your prompt and any CLI options:

```bash
claude -p "Find and fix the bug in auth.py" --allowedTools "Read,Edit,Bash"
```

This page covers using the Agent SDK via the CLI (`claude -p`). For the Python and TypeScript SDK packages with structured outputs, tool approval callbacks, and native message objects, see the full Agent SDK documentation.

## Basic usage

Add the `-p` (or `--print`) flag to any `claude` command to run it non-interactively. All CLI options work with `-p`, including:

- `--continue` for [continuing conversations](#continue-conversations)
- `--allowedTools` for [auto-approving tools](#auto-approve-tools)
- `--output-format` for [structured output](#get-structured-output)

This example asks Claude a question about your codebase and prints the response:

```bash
claude -p "What does the auth module do?"
```

## Bare mode

Add `--bare` to reduce startup time by skipping auto-discovery of hooks, skills, plugins, MCP servers, auto memory, and CLAUDE.md. Without it, `claude -p` loads the same context an interactive session would, including anything configured in the working directory or `~/.claude`.

Bare mode is useful for CI and scripts where you need the same result on every machine. A hook in a teammate's `~/.claude` or an MCP server in the project's `.mcp.json` won't run, because bare mode never reads them. Only flags you pass explicitly take effect.

This example runs a one-off summarize task in bare mode and pre-approves the Read tool so the call completes without a permission prompt:

```bash
claude --bare -p "Summarize this file" --allowedTools "Read"
```

In bare mode, Claude has access to the Bash, file read, and file edit tools. Pass any context you need with a flag:

| To load                  | Use                                            |
| ------------------------ | ---------------------------------------------- |
| System prompt additions  | `--append-system-prompt`, `--append-system-prompt-file` |
| Settings                 | `--settings <file-or-json>`                    |
| MCP servers              | `--mcp-config <file-or-json>`                  |
| Custom agents            | `--agents <json>`                              |
| A plugin directory       | `--plugin-dir <path>`                          |

Bare mode skips OAuth and keychain reads. Anthropic authentication must come from `ANTHROPIC_API_KEY` or an `apiKeyHelper` in the JSON passed to `--settings`.

## Examples

These examples highlight common CLI patterns. For CI and other scripted calls, add `--bare` so they don't pick up whatever happens to be configured locally.

### Get structured output

Use `--output-format` to control how responses are returned:

- `text` (default): plain text output
- `json`: structured JSON with result, session ID, and metadata
- `stream-json`: newline-delimited JSON for real-time streaming

This example returns a project summary as JSON with session metadata, with the text result in the `result` field:

```bash
claude -p "Summarize this project" --output-format json
```

To get output conforming to a specific schema, use `--output-format json` with `--json-schema` and a JSON Schema definition:

```bash
claude -p "Extract the main function names from auth.py" \
  --output-format json \
  --json-schema '{"type":"object","properties":{"functions":{"type":"array","items":{"type":"string"}}},"required":["functions"]}'
```

The response includes metadata about the request (session ID, usage, etc.) with the structured output in the `structured_output` field.

### Stream responses

Use `--output-format stream-json` with `--verbose` and `--include-partial-messages` to receive tokens as they are generated. Each line is a JSON object representing an event:

```bash
claude -p "Explain recursion" --output-format stream-json --verbose --include-partial-messages
```

Stream events include:

- **system/init**: Session metadata including the model, tools, MCP servers, loaded plugins, and any `plugin_errors`
- **system/api_retry**: Retry progress when an API request fails with a retryable error (includes `attempt`, `max_retries`, `retry_delay_ms`, `error_status`, `error` category)
- **system/plugin_install**: Plugin install progress when `CLAUDE_CODE_SYNC_PLUGIN_INSTALL` is set
- **stream_event**: Token deltas as they are generated

Example using jq to filter for text deltas:

```bash
claude -p "Write a poem" --output-format stream-json --verbose --include-partial-messages | \
  jq -rj 'select(.type == "stream_event" and .event.delta.type? == "text_delta") | .event.delta.text'
```

### Auto-approve tools

Use `--allowedTools` to let Claude use certain tools without prompting:

```bash
claude -p "Run the test suite and fix any failures" \
  --allowedTools "Bash,Read,Edit"
```

To set a baseline for the whole session instead of listing individual tools, pass a permission mode:

- `dontAsk`: Denies anything not in your `permissions.allow` rules or the read-only command set. Useful for locked-down CI runs.
- `acceptEdits`: Lets Claude write files without prompting and also auto-approves common filesystem commands such as `mkdir`, `touch`, `mv`, and `cp`. Other shell commands and network requests still need an `--allowedTools` entry or a `permissions.allow` rule.

```bash
claude -p "Apply the lint fixes" --permission-mode acceptEdits
```

### Customize the system prompt

Use `--append-system-prompt` to add instructions while keeping Claude Code's default behavior:

```bash
gh pr diff "$1" | claude -p \
  --append-system-prompt "You are a security engineer. Review for vulnerabilities." \
  --output-format json
```

See [system prompt flags](/en/cli-reference#system-prompt-flags) for more options including `--system-prompt` to fully replace the default prompt.

### Continue conversations

Use `--continue` to continue the most recent conversation, or `--resume` with a session ID to continue a specific conversation:

```bash
# First request
claude -p "Review this codebase for performance issues"

# Continue the most recent conversation
claude -p "Now focus on the database queries" --continue
claude -p "Generate a summary of all issues found" --continue
```

If you're running multiple conversations, capture the session ID to resume a specific one:

```bash
session_id=$(claude -p "Start a review" --output-format json | jq -r '.session_id')
claude -p "Continue that review" --resume "$session_id"
```

## Next steps

- **Agent SDK quickstart**: Build your first agent with Python or TypeScript
- **CLI reference**: Explore all CLI flags and options
- **GitHub Actions**: Use the Agent SDK in GitHub workflows
- **GitLab CI/CD**: Use the Agent SDK in GitLab pipelines
