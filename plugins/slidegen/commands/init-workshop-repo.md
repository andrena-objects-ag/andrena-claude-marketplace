# /init-workshop-repo

Initialize a git repository, commit all existing files, and push to a private GitHub repository for your workshop or presentation materials.

**Arguments for $ARGUMENTS:**
- Position 1: `repo-name` (required): The name for your GitHub repository (will be used as the GitHub repo name)
- Position 2: `description` (optional): Description for the GitHub repository (default: "Workshop materials and presentation resources")
- Position 3: `visibility` (optional): `private` or `public` (defaults to `private`)
- Position 4: `initial-commit-message` (optional): Custom initial commit message (default: "Initial commit: Add workshop materials")

## Workflow

The command follows this sequence:
1. Check if the current directory is already a git repository
2. If not, initialize a new git repository with `git init`
3. Add all existing files to git with `git add .`
4. Create initial commit with specified or default message
5. Create a new GitHub repository using the GitHub CLI
6. Add the remote origin
7. Push the initial commit to the new repository
8. Display the repository URL and next steps

## Example Usage

```bash
# Basic usage - create private repo with default settings
/init-workshop-repo "advanced-git-workshop"

# With custom description and visibility
/init-workshop-repo "python-for-data-science" "Complete Python workshop materials" public

# With custom initial commit message
/init-workshop-repo "docker-deep-dive" "Docker containerization workshop" private "Add initial Docker workshop content"
```

## What Gets Committed

All files in the current directory will be included in the initial commit, including:
- Presentation files (Marp/Slidev)
- Workshop notes and documentation
- Code examples and exercises
- Configuration files
- README files

**Note**: This command requires GitHub CLI (`gh`) to be installed and authenticated. If not available, you'll be prompted to install it or manually create the repository on GitHub.

Create and initialize a git repository for your workshop with the name $ARGUMENTS. Parse the arguments to determine repository name, description, visibility, and initial commit message.