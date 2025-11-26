# 1. `/api/chat` Handler – Requirements Document (v1: Simple Chat)

## 1. Purpose

Define a single HTTP API endpoint (`POST /api/chat`) used by the frontend chat UI to:

- Send a conversation history.
    
- Receive a single assistant reply from the local NeuralDaredevil-8B-abliterated model running on Unraid.
    
- Enforce **no persistence** of message contents and strict privacy.
    
- Provide a stable contract for the frontend while abstracting the underlying LLM server (llama.cpp/Ollama).
    

---

## 2. Endpoint Overview

- **Method:** `POST`
    
- **Path:** `/api/chat`
    
- **Auth:** None (v1).
    
- **Request Body:** JSON
    
- **Response Body:** JSON
    
- **Streaming:** No (Single shot response).
    

---

## 3. Request Schema

### 3.1 JSON structure

TypeScript

```
// Request type
type ChatRequest = {
  session_id: string;            // UUID or unique string per browser session
  messages: ChatMessage[];       // full dialogue history (truncated client-side)
  max_new_tokens?: number;       // optional cap for response length
  temperature?: number;          // optional sampling params override
  top_p?: number;
  top_k?: number;
};

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};
```

### 3.2 Constraints / validation

- `session_id`
    
    - Required, non-empty string, max length: 128 chars.
        
- `messages`
    
    - Required, non-empty array.
        
    - Each `content` length ≤ 8,000 characters (server-side validation).
        
    - **Total Context Check:** If total content length exceeds model context window (approx 8k tokens), server must **truncate/drop** the oldest user messages, ensuring the System Prompt remains intact.
        
- Optional generation params (with defaults):
    
    - `max_new_tokens`: Default `256` (Min `16`, Max `2048`)
        
    - `temperature`: Default `0.8` (Range `0.1`–`1.5`)
        
    - `top_p`: Default `0.9`
        
    - `top_k`: Default `50`
        

If validation fails, respond with `400 Bad Request` + JSON error.

---

## 4. Response Schema

### 4.1 JSON structure

TypeScript

```
type ChatResponse = {
  reply: string;                 // model's message content
  usage?: {                      // optional metrics
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
  session_id?: string;           // echo of input session_id
};
```

### 4.2 Status codes

- `200 OK` – Success.
    
- `400 Bad Request` – Schema validation errors.
    
- `429 Too Many Requests` – Rate limit exceeded.
    
- `500 Internal Server Error` – Code error or parsing failure.
    
- `503 Service Unavailable` – LLM backend (Unraid container) unreachable.
    

**Error Body:**

JSON

```
{
  "error": {
    "code": "LLM_CONNECTION_ERROR",
    "message": "Unable to contact the neural engine."
  }
}
```

---

## 5. Behavior & Logic

### 5.1 High-level flow

1. **Parse & Validate:** Check JSON schema.
    
2. **Context Construction:**
    
    - Load the **Global System Prompt** (from Env Var `SYSTEM_PROMPT` or a static `config/system.txt` file).
        
    - Construct the message array: `[ {role: "system", content: GLOBAL_PROMPT}, ...user_messages ]`.
        
3. **Trimming:** Calculate approximate token count. If budget exceeded, remove oldest `user` or `assistant` messages (never remove the System prompt).
    
4. **Inference Call:** Pass the cleaned array to the LLM Client Adapter.
    
5. **Response:** Extract text, format JSON, return `200`.
    

### 5.2 Privacy & Logging (CRITICAL)

- **Strict "Void" Policy:**
    
    - **NEVER** write `messages` content or `reply` content to disk or database.
        
    - **NEVER** log the prompt text or response text to the console (stdout/stderr).
        
- **Allowed Logs:**
    
    - Metadata only: `timestamp`, `session_id`, `latency_ms`, `status_code`, `response_length`.
        
    - Error logs: specific error codes, but **redact** any actual prompt content from stack traces if possible.
        

---

## 6. LLM Backend Adapter Requirements

_This adapter isolates the API from the specific LLM runner (llama.cpp vs Ollama)._

### 6.1 Adapter Interface

TypeScript

```
type LlmRequest = {
  messages: ChatMessage[];  // finalized list including system prompt
  max_new_tokens: number;
  temperature: number;
  top_p: number;
  top_k?: number;
};

type LlmResponse = {
  reply: string;
  usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number; };
};

// The generic function the handler calls
async function generateCompletion(req: LlmRequest): Promise<LlmResponse>;
```

### 6.2 Connection details (Environment Variables)

The implementation must use Environment Variables for connection to the Unraid Docker container:

- `LLM_API_URL`: e.g., `http://192.168.x.x:8080/completion`
    
- `LLM_MODEL_NAME`: (Optional, mainly for Ollama) e.g., `neuraldaredevil`
    

---

## 7. Rate Limiting

- **Scope:** Per IP address.
    
- **Limit:** Max 30 requests per minute (configurable via env `RATE_LIMIT_MAX`).
    
- **Response:** `429 Too Many Requests` (No body content leaked).
    

---

## 8. Non-Goals (v1)

- No multiple characters/personas.
    
- No user accounts or login.
    
- No persistent chat history database.
    
- No streaming (SSE).