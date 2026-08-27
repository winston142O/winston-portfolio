"use server";

import { Resend } from "resend";
import { profile } from "@/content/profile";

export interface ContactFormState {
  status: "idle" | "success" | "error";
  error?: "invalid" | "not_configured" | "send_failed";
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function sendContactMessage(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  // Honeypot: real users never fill this hidden field
  if (formData.get("website")) {
    return { status: "success" };
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (
    name.length < 2 ||
    name.length > 200 ||
    !EMAIL_RE.test(email) ||
    message.length < 10 ||
    message.length > 5000
  ) {
    return { status: "error", error: "invalid" };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { status: "error", error: "not_configured" };
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM ?? "Portfolio <onboarding@resend.dev>",
    to: process.env.CONTACT_TO_EMAIL ?? profile.email,
    replyTo: email,
    subject: `Portfolio contact from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
  });

  if (error) {
    console.error("Contact form send failed:", error);
    return { status: "error", error: "send_failed" };
  }
  return { status: "success" };
}
