import { createFileRoute } from "@tanstack/react-router";

// Speech-to-text via Lovable AI Gateway. Client uploads a recorded blob;
// we forward to the gateway as multipart/form-data and stream SSE back.
//
// POST /api/public/transcribe  body: multipart/form-data { file, language? }

export const Route = createFileRoute("/api/public/transcribe")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env.LOVABLE_API_KEY;
        if (!apiKey) {
          return new Response(
            JSON.stringify({ error: "LOVABLE_API_KEY not configured" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }

        const ct = request.headers.get("content-type") || "";
        if (!ct.startsWith("multipart/form-data")) {
          return new Response("Expected multipart/form-data", { status: 400 });
        }

        let form: FormData;
        try {
          form = await request.formData();
        } catch {
          return new Response("Invalid form data", { status: 400 });
        }

        const file = form.get("file");
        if (!(file instanceof Blob) || file.size < 1024) {
          return new Response(
            JSON.stringify({ error: "Recording was empty or too short. Please try again." }),
            { status: 400, headers: { "Content-Type": "application/json" } },
          );
        }
        if (file.size > 24 * 1024 * 1024) {
          return new Response(
            JSON.stringify({ error: "Recording too long. Please keep it under 60 seconds." }),
            { status: 413, headers: { "Content-Type": "application/json" } },
          );
        }

        // Map MIME → extension so OpenAI infers the container correctly.
        const mime = (file.type || "audio/webm").split(";")[0];
        const ext =
          mime === "audio/mp4" ? "mp4" :
          mime === "audio/mpeg" ? "mp3" :
          mime === "audio/wav" ? "wav" :
          mime === "audio/ogg" ? "ogg" :
          "webm";

        const upstream = new FormData();
        upstream.append("model", "openai/gpt-4o-mini-transcribe");
        upstream.append("file", file, `recording.${ext}`);
        upstream.append("stream", "true");
        const lang = form.get("language");
        if (typeof lang === "string" && /^[a-z]{2}$/.test(lang)) {
          upstream.append("language", lang);
        }

        const res = await fetch(
          "https://ai.gateway.lovable.dev/v1/audio/transcriptions",
          {
            method: "POST",
            headers: { Authorization: `Bearer ${apiKey}` },
            body: upstream,
          },
        );

        if (!res.ok || !res.body) {
          const text = await res.text().catch(() => "");
          return new Response(
            JSON.stringify({ error: text || `Transcription failed (${res.status})` }),
            { status: res.status, headers: { "Content-Type": "application/json" } },
          );
        }

        return new Response(res.body, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
          },
        });
      },
    },
  },
});
