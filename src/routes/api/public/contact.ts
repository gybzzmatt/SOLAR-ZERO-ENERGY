import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const schema = z.object({
  segment: z.string().min(1).max(40),
  nombre: z.string().min(1).max(120),
  email: z.string().email().max(200),
  telefono: z.string().min(3).max(40),
  provincia: z.string().min(1).max(80),
  factura: z.string().max(20).optional().default(""),
  consumoKwh: z.string().max(20).optional().default(""),
  notas: z.string().max(2000).optional().default(""),
});

export const Route = createFileRoute("/api/public/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }
        const parsed = schema.safeParse(body);
        if (!parsed.success) {
          return Response.json({ error: "invalid_input", issues: parsed.error.issues }, { status: 400 });
        }
        const data = parsed.data;

        // Send via Lovable Email API when configured; otherwise log and accept.
        const apiKey = process.env.LOVABLE_API_KEY;
        const notifyTo = process.env.CONTACT_NOTIFY_TO;
        const notifyFrom = process.env.CONTACT_NOTIFY_FROM;

        const subject = `Nueva cotización Solar Zero · ${data.segment} · ${data.nombre}`;
        const html = `
          <h2>Nueva solicitud de cotización</h2>
          <p><strong>Segmento:</strong> ${escape(data.segment)}</p>
          <p><strong>Nombre:</strong> ${escape(data.nombre)}</p>
          <p><strong>Email:</strong> ${escape(data.email)}</p>
          <p><strong>Teléfono:</strong> ${escape(data.telefono)}</p>
          <p><strong>Provincia:</strong> ${escape(data.provincia)}</p>
          <p><strong>Factura (USD):</strong> ${escape(data.factura || "—")}</p>
          <p><strong>Consumo (kWh):</strong> ${escape(data.consumoKwh || "—")}</p>
          <p><strong>Notas:</strong><br>${escape(data.notas || "—").replace(/\n/g, "<br>")}</p>
        `;

        if (apiKey && notifyTo && notifyFrom) {
          try {
            const { sendLovableEmail } = await import("@lovable.dev/email-js");
            await sendLovableEmail({
              apiKey,
              from: notifyFrom,
              to: notifyTo,
              subject,
              html,
              replyTo: data.email,
            });
          } catch (err) {
            console.error("[contact] email send failed", err);
          }
        } else {
          console.log("[contact] submission (email not configured):", data);
        }

        return Response.json({ ok: true });
      },
    },
  },
});

function escape(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
