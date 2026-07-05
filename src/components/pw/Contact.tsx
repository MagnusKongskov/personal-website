"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container";
import GetContactedButton from "@/components/GetContactedButton";
import FeedbackBubble from "@/components/FeedbackBubble";
import { color2 } from "@/components/pw/colors";

const inputClassName =
  "mt-1.5 w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/40 focus:border-[#f97316]";

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function FormField({
  id,
  label,
  type = "text",
  placeholder,
  rows,
  value,
  onChange,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  rows?: number;
  value: string;
  onChange: (value: string) => void;
}) {
  const sharedProps = {
    id,
    name: id,
    placeholder,
    className: inputClassName,
    value,
    onChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => onChange(event.target.value),
  };

  return (
    <div>
      <label
        htmlFor={id}
        className="block pl-1 text-sm font-medium text-white/90"
      >
        {label}
      </label>
      {rows ? (
        <textarea {...sharedProps} rows={rows} />
      ) : (
        <input type={type} {...sharedProps} />
      )}
    </div>
  );
}

export default function Contact({
  title = "Still in doubt?",
  description = "If you unsure whether a personal website is for you, i will happily answer your questions.",
}: {
  title?: string;
  description?: string;
} = {}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleErrorDismiss = useCallback(() => {
    setError("");
  }, []);

  const handleSuccessDismiss = useCallback(() => {
    setSuccess(false);
  }, []);

  async function handleGetContacted() {
    setError("");
    setSuccess(false);

    if (!email.trim()) {
      setError("Please add an email.");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!agreedToTerms) {
      setError(
        "For legal reasons i cannot accept you information before you have agreed to the terms & privacy.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "personal",
          name,
          email,
          company,
          phone,
          message,
          agreedToTerms,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setSuccess(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="contact" className="py-6 sm:py-8">
      <Container>
        <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-white/70">
          {description}
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-[3fr_1fr] lg:gap-8">
          <form
            className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5"
            onSubmit={(event) => event.preventDefault()}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <FormField
                id="pw-name"
                label="Name"
                placeholder="Name"
                value={name}
                onChange={setName}
              />
              <FormField
                id="pw-email"
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={setEmail}
              />
              <div className="hidden sm:block">
                <FormField
                  id="pw-company"
                  label="Company Name"
                  placeholder="Company name"
                  value={company}
                  onChange={setCompany}
                />
              </div>
              <div className="hidden sm:block">
                <FormField
                  id="pw-phone"
                  label="Phone Number"
                  type="tel"
                  placeholder="Phone number (optional)"
                  value={phone}
                  onChange={setPhone}
                />
              </div>
            </div>

            <FormField
              id="pw-message"
              label="Message"
              placeholder="Optional message"
              rows={5}
              value={message}
              onChange={setMessage}
            />

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="flex min-w-0 flex-1 items-center gap-2 text-xs text-white/70">
                <input
                  id="pw-terms-agreement"
                  type="checkbox"
                  name="terms"
                  checked={agreedToTerms}
                  onChange={(event) => setAgreedToTerms(event.target.checked)}
                  className="h-3.5 w-3.5 shrink-0 rounded border-white/30 accent-[#f97316]"
                />
                <p className="min-w-0">
                  <label
                    htmlFor="pw-terms-agreement"
                    className="cursor-pointer"
                  >
                    By submitting my information i agree to the{" "}
                  </label>
                  <Link
                    href="/tp"
                    className="text-white underline transition-colors hover:opacity-80"
                  >
                    terms &amp; privacy
                  </Link>
                </p>
              </div>

              <div className="relative shrink-0">
                {error ? (
                  <FeedbackBubble
                    message={error}
                    theme="dark"
                    onDismiss={handleErrorDismiss}
                  />
                ) : null}
                {success ? (
                  <FeedbackBubble
                    message="Message sent. I will get back to you as soon as possible."
                    variant="success"
                    theme="dark"
                    onDismiss={handleSuccessDismiss}
                  />
                ) : null}
                <GetContactedButton
                  onClick={handleGetContacted}
                  isLoading={isSubmitting}
                  className="border-transparent bg-[#f97316] text-white hover:bg-[#f97316] hover:opacity-90"
                />
              </div>
            </div>
          </form>

          <aside className="hidden flex-col lg:flex">
            <div
              className="flex w-full flex-col items-center overflow-hidden rounded-2xl border-2 bg-white/[0.04] p-4 text-center sm:p-5"
              style={{ borderColor: color2 }}
            >
              <div
                className="relative aspect-square w-48 overflow-hidden rounded-full border-2 sm:w-56"
                style={{ borderColor: color2 }}
              >
                <Image
                  src="/profpic.png"
                  alt="Magnus Kongskov"
                  fill
                  className="object-cover object-[center_20%]"
                  sizes="(max-width: 640px) 192px, 224px"
                />
              </div>
              <div className="mt-6">
                <p className="text-lg font-semibold">Magnus Kongskov</p>
                <p className="mt-1 text-sm text-white/60">
                  Freelance Web Designer
                  <br />
                  <a
                    href="mailto:primary@magnuskongskov.dk"
                    className="text-white underline transition-colors hover:opacity-80"
                  >
                    primary@magnuskongskov.dk
                  </a>
                </p>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}
