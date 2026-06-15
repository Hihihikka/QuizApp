# AI Rules and Constraints

## Language Policy
- ALWAYS respond to the user in Russian.
- Keep code comments in English, but all chat explanations must be in Russian.

## Safety and Modifications (CRITICAL)
- NEVER rewrite entire files. Only suggest specific, incremental changes (diffs).
- DO NOT install, import, or suggest new NPM packages without explicit user permission.
- DO NOT delete or move existing files/folders autonomously.
- If you notice potential architectural issues, ask the user BEFORE making any code changes.

## React Code Style
- Use functional components with hooks. Do not use class components.
- Keep components modular and small. Do not bundle layout, state, and logic into one giant file.
- Do not create mock backend APIs unless explicitly requested. Use local React state or simple dummy data for frontend-only tasks.
- Follow the existing code style and conventions of the project. Do not introduce new patterns without user approval.
- Always ask for clarification if the requirements are ambiguous or if you are unsure about the best way to implement a feature. Do not make assumptions that could lead to incorrect implementations.