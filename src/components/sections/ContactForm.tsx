"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import {
  sendContactMessage,
  type ContactFormState,
} from "@/app/actions/contact";

const initialState: ContactFormState = { status: "idle" };

export function ContactForm() {
  const t = useTranslations("Contact");
  const [state, formAction, pending] = useActionState(
    sendContactMessage,
    initialState,
  );

  if (state.status === "success") {
    return (
      <p className="mt-8 rounded-xl border border-emerald-900/60 bg-emerald-950/30 px-6 py-5 text-emerald-300">
        {t("form_success")}
      </p>
    );
  }

  return (
    <form action={formAction} className="mt-8 w-full max-w-lg text-left">
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm text-neutral-400">{t("form_name")}</span>
          <input
            type="text"
            name="name"
            required
            minLength={2}
            maxLength={200}
            className="rounded-lg border border-neutral-800 bg-neutral-950/80 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm text-neutral-400">{t("form_email")}</span>
          <input
            type="email"
            name="email"
            required
            className="rounded-lg border border-neutral-800 bg-neutral-950/80 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500"
          />
        </label>
      </div>
      <label className="mt-4 flex flex-col gap-1.5">
        <span className="text-sm text-neutral-400">{t("form_message")}</span>
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={5}
          className="rounded-lg border border-neutral-800 bg-neutral-950/80 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500"
        />
      </label>
      {state.status === "error" && (
        <p className="mt-3 text-sm text-red-400">
          {state.error === "invalid" ? t("form_invalid") : t("form_error")}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="mt-5 w-full rounded-full bg-emerald-500 px-8 py-3.5 font-semibold text-black transition hover:bg-emerald-400 disabled:opacity-60 sm:w-auto"
      >
        {pending ? t("form_sending") : t("form_send")}
      </button>
    </form>
  );
}
