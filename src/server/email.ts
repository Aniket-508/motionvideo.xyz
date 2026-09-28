import { env } from "cloudflare:workers";

import { site } from "@/lib/site";

interface Email {
  to: string;
  subject: string;
  html: string;
  text: string;
}

// Single seam for outbound email: swap providers by editing this function.
export const sendEmail = async (email: Email): Promise<void> => {
  if (!env.RESEND_API_KEY) {
    if (import.meta.env.DEV) {
      console.info(
        `\n[email] to=${email.to} subject="${email.subject}"\n${email.text}\n`
      );
      return;
    }
    throw new Error("RESEND_API_KEY is not configured");
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.EMAIL_FROM,
      to: [email.to],
      subject: email.subject,
      html: email.html,
      text: email.text,
    }),
  });
  if (!res.ok) {
    throw new Error(`Resend responded ${res.status}: ${await res.text()}`);
  }
};

export const magicLinkEmail = (to: string, url: string): Email => ({
  to,
  subject: `Sign in to ${site.name}`,
  text: `Sign in to ${site.name}:\n\n${url}\n\nThis link expires in 15 minutes. If you didn't request it, ignore this email.`,
  html: `<div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#111">
  <h1 style="font-size:18px;margin:0 0 16px">Sign in to ${site.name}</h1>
  <p style="margin:0 0 24px;color:#444">Click the button below to sign in. This link expires in 15 minutes.</p>
  <a href="${url}" style="display:inline-block;background:#111;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none;font-weight:500">Sign in</a>
  <p style="margin:24px 0 0;font-size:12px;color:#888">If you didn't request this email, you can safely ignore it.</p>
</div>`,
});
