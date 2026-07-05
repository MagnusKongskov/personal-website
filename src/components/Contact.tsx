"use client";

import { useState } from "react";
import Link from "next/link";
import Container from "@/components/Container";
import GetContactedButton from "@/components/GetContactedButton";
import BuyNowButton from "@/components/BuyNowButton";

const BASE_PRICE = 335;
const MOBILE_COMPATIBILITY_PRICE = 140;

const inputClassName =
  "mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-accent";

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
      <label htmlFor={id} className="block text-sm font-medium">
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

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [webpage, setWebpage] = useState("");
  const [message, setMessage] = useState("");
  const [mobileCompatibility, setMobileCompatibility] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const price = mobileCompatibility
    ? BASE_PRICE + MOBILE_COMPATIBILITY_PRICE
    : BASE_PRICE;

  async function handleGetContacted() {
    setError("");
    setSuccess(false);

    if (!email.trim()) {
      setError("Please add an email.");
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
          name,
          email,
          company,
          phone,
          url: webpage,
          message,
          phoneIncluded: mobileCompatibility,
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
    <section id="contact" className="py-24">
      <Container>
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Get in touch
        </h2>
        <p className="mt-4 text-muted">
          Have a question or want to collaborate? Send a message and I&apos;ll
          get back to you.
        </p>

        <div className="mt-10 grid gap-12 lg:grid-cols-[3fr_1fr] lg:gap-16">
          <form
            className="space-y-6"
            onSubmit={(event) => event.preventDefault()}
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <FormField
                id="name"
                label="Your Name"
                placeholder="Your name"
                value={name}
                onChange={setName}
              />
              <FormField
                id="email"
                label="Your Email Address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={setEmail}
              />
              <FormField
                id="company"
                label="Your Company Name"
                placeholder="Your company"
                value={company}
                onChange={setCompany}
              />
              <FormField
                id="phone"
                label="Your Phone Number"
                type="tel"
                placeholder="Your phone number"
                value={phone}
                onChange={setPhone}
              />
            </div>

            <FormField
              id="webpage"
              label="Your Webpage Link"
              type="url"
              placeholder="https://example.com"
              value={webpage}
              onChange={setWebpage}
            />

            <FormField
              id="message"
              label="Message"
              placeholder="Your message..."
              rows={5}
              value={message}
              onChange={setMessage}
            />

            <div className="space-y-4 pt-2">
              <label className="flex cursor-pointer items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={mobileCompatibility}
                  onChange={(event) =>
                    setMobileCompatibility(event.target.checked)
                  }
                  className="mt-0.5 h-4 w-4 rounded border-border accent-foreground"
                />
                <span>
                  Add review for mobile compatibility (
                  {MOBILE_COMPATIBILITY_PRICE}$)
                </span>
              </label>

              <label className="flex cursor-pointer items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  name="terms"
                  checked={agreedToTerms}
                  onChange={(event) => setAgreedToTerms(event.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-border accent-foreground"
                />
                <span>
                  By submitting my information i agree to the{" "}
                  <Link
                    href="/tp"
                    className="text-foreground underline transition-colors hover:opacity-80"
                  >
                    terms &amp; privacy
                  </Link>{" "}
                  regarding the landing page review
                </span>
              </label>
            </div>

            {error ? (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            ) : null}

            {success ? (
              <p className="text-sm text-green-600" role="status">
                Message sent. I will get back to you as soon as possible.
              </p>
            ) : null}

            <div className="flex flex-wrap gap-4 pt-2">
              <GetContactedButton
                onClick={handleGetContacted}
                isLoading={isSubmitting}
              />
              <BuyNowButton price={price} />
            </div>
          </form>

          <aside className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <div
              className="aspect-square w-48 overflow-hidden rounded-full border-2 border-border bg-foreground/5 sm:w-56"
              aria-label="Profile picture placeholder"
            />
            <div className="mt-6">
              <p className="text-lg font-semibold">Magnus Kongskov</p>
              <p className="mt-1 text-sm text-muted">
                freelance web design expert
              </p>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}
