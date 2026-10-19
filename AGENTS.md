# Project Instructions for AI Agents

This file defines the rules and standards for all AI agents that operate in this repository.

## 1. Language Standard: Simplified Technical English (ASD-STE100)

All agents must use Simplified Technical English (STE) for:
- User communications and responses.
- Code documentation, explanations, and comments.
- Git commit messages and pull request descriptions.
- Technical specifications and instructions.

### Core Rules of Simplified Technical English (STE)

1. **Short Sentences**:
   - Limit procedural sentences (instructions and steps) to a maximum of 20 words.
   - Limit descriptive sentences to a maximum of 25 words.
   - Express only one command or fact per sentence.

2. **Simple and Consistent Words**:
   - Use approved, simple, and direct words.
   - Use each word with only one chosen meaning.
   - Do not use slang, idioms, metaphors, or buzzwords.
   - Avoid vague words like "various", "several", or "leveraging".

3. **Active Voice and Imperative Mood**:
   - Write instructions in the imperative mood (e.g., "Open the file.", "Run the test.").
   - Write descriptive text in the active voice. Specify the subject that performs the action.

4. **Noun Clusters**:
   - Do not use more than three nouns together in a sequence.
   - Break long noun strings with prepositions.

5. **Pronouns**:
   - Avoid ambiguous pronouns such as "it", "this", "that", and "they".
   - Repeat the specific noun to ensure clarity.

6. **Verb Tenses**:
   - Use the simple present tense for general facts and current states.
   - Use the simple past tense for completed actions.
   - Use the simple future tense for future actions.
   - Avoid continuous and progressive forms when simple tenses are possible.

---

## 2. Project Architecture and Guidelines

- **Architecture**: Static website with multi-page structure. No complex build step.
- **Target Audience**: Ahaan (a child reader and learner).
- **Sensory-Friendly Design**: Follow guidelines in `docs/sensory-friendly-spec.md`.
  - Audio must remain silent until the user requests sound.
  - Respect the user's motion preferences. Provide controls to stop motion.
  - Maintain readable contrast and visible focus rings.
- **Integrity**:
  - Preserve all existing comments and documentation that are unrelated to new changes.
  - Keep all code modular, accessible, and lightweight.

---

## 3. Parallel Task Execution

- **Parallel Work**: Maximize parallel execution for all tasks.
- **Task Decomposition**: Divide large tasks into independent, small units of work.
- **Concurrent Subagents**: Launch subagents concurrently to handle independent tasks in parallel.
- **Tool Concurrency**: Execute independent tool calls concurrently rather than serially.
- **No Unnecessary Waiting**: Do not wait for unrelated tasks before starting the next task.

---

## 4. Git Worktree Workflow

- **Isolated Workspaces**: Always use Git worktrees for feature development and experiments.
- **Clean Main Tree**: Keep the primary working tree clean and synchronized with `main`.
- **Worktree Directory**: Store worktrees in the `.worktrees/` directory at the project root.
- **Git Ignore**: Ensure `.worktrees/` is listed in `.gitignore`.
- **Create Worktree**: Use `git worktree add .worktrees/<branch-name> -b <branch-name>` for new tasks.
- **Work Off Worktree**: Perform edits, tests, and commits inside the designated worktree path.
- **Cleanup**: Remove the worktree with `git worktree remove` after merging the branch.
