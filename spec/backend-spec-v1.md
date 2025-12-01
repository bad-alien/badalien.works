Backend Specification — The Void (v1)
Overview

This backend provides a single stateless API endpoint, POST /api/chat, inside the existing Next.js application. The endpoint accepts a list of chat messages from the frontend, prepends a fixed system prompt defining “The Void,” and returns a model-generated reply. No data is stored, no history is logged, and no persistent state exists between requests. The backend serves as a thin, privacy-preserving gateway between the Next.js UI and a local LLM hosted on my Unraid server.

Architecture

The backend consists of two parts:

API Route: /api/chat

Performs request validation (ensuring messages exists, roles are valid, lengths are reasonable).

Prepends a fixed system message defining The Void’s voice and behavior.

Calls an internal helper function generateCompletion() to produce the model reply.

Returns a JSON object containing { reply, usage? }.

Stores nothing, logs nothing sensitive, and wipes all message content after responding.

LLM Client Module (llmClient)

Provides a single function:
generateCompletion({ messages, max_new_tokens?, temperature?, top_p?, top_k? }).

In v1, this function returns a stubbed response so the frontend can be implemented immediately.

Later, this will forward the request to a local llama.cpp/Ollama inference server on Unraid using an environment variable LLM_BASE_URL.

Converts chat-style messages into the model’s expected payload format and extracts the model’s reply.

Goals (v1)

Zero persistence: no DB writes, no log storage of message content.

Stateless execution: each request contains all context needed; server keeps nothing afterward.

Clean separation: /api/chat handles HTTP logic; generateCompletion handles LLM logic.

Simple testing: “stub mode” works before the LLM endpoint is live.

Minimal surface area: no streaming, no auth, no character selector, no multi-user memory.