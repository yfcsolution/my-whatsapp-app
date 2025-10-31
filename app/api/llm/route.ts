export const runtime = "nodejs"

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

interface GroqRequestPayload {
  messages: Array<{ role: string; content: string }>
  temperature?: number
  max_completion_tokens?: number
  top_p?: number
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  })
}

export async function POST(req: Request) {
  const apiKey = process.env.GROQ_API_KEY

  if (!apiKey) {
    return jsonResponse({ error: "GROQ_API_KEY is not configured" }, 500)
  }

  let payload: GroqRequestPayload

  try {
    payload = await req.json()
  } catch (error) {
    return jsonResponse({ error: "Invalid request body", details: String(error) }, 400)
  }

  if (!payload.messages || !Array.isArray(payload.messages) || payload.messages.length === 0) {
    return jsonResponse({ error: "Request must include a non-empty messages array" }, 400)
  }

  const requestBody = {
    model: "moonshotai/kimi-k2-instruct-0905",
    stream: true,
    temperature: payload.temperature ?? 0.6,
    max_completion_tokens: payload.max_completion_tokens ?? 4096,
    top_p: payload.top_p ?? 1,
    messages: payload.messages,
  }

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  })

  if (!response.ok || !response.body) {
    const errorText = await response.text()
    return jsonResponse({ error: "Groq request failed", details: errorText }, response.status)
  }

  return new Response(response.body, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("content-type") ?? "text/event-stream",
      "Cache-Control": "no-cache",
    },
  })
}
