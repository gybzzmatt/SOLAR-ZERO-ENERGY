import { createFileRoute } from "@tanstack/react-router";

// Public telemetry sink. Logs a compact summary to the worker console so it
// shows up in server-function-logs. Kept intentionally simple — no DB writes,
// no PII. If this becomes noisy, add sampling here.
export const Route = createFileRoute("/api/public/telemetry")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const raw = await request.text();
          // Cap payload to avoid log spam / abuse
          const body = raw.length > 16_000 ? raw.slice(0, 16_000) + "…" : raw;
          const data = JSON.parse(body) as {
            route?: string;
            session?: string;
            device?: {
              formFactor?: string;
              vw?: number;
              vh?: number;
              dpr?: number;
              conn?: string;
              cores?: number;
              mem?: number;
            };
            metrics?: { name: string; value: number; rating?: string; extra?: unknown }[];
          };
          const d = data.device ?? {};
          const summary = (data.metrics ?? [])
            .map((m) => `${m.name}=${m.value.toFixed?.(1) ?? m.value}${m.rating ? "/" + m.rating : ""}`)
            .join(" ");
          // Single-line log so it's grep-friendly in worker logs
          // eslint-disable-next-line no-console
          console.log(
            `[telemetry] route=${data.route ?? "?"} form=${d.formFactor ?? "?"} vw=${d.vw ?? "?"} dpr=${
              d.dpr ?? "?"
            } conn=${d.conn ?? "?"} cores=${d.cores ?? "?"} mem=${d.mem ?? "?"} session=${
              data.session ?? "?"
            } ${summary}`
          );
          return new Response("ok", { status: 204 });
        } catch (err) {
          // eslint-disable-next-line no-console
          console.warn("[telemetry] bad payload", (err as Error).message);
          return new Response("bad request", { status: 400 });
        }
      },
    },
  },
});
