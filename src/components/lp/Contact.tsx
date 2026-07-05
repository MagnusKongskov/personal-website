"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container";
import GetContactedButton from "@/components/GetContactedButton";
import BuyNowButton from "@/components/lp/BuyNowButton";
import FeedbackBubble from "@/components/FeedbackBubble";

const BASE_PRICE = 335;
const MOBILE_COMPATIBILITY_PRICE = 140;

const inputClassName =
  "mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-accent";

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
      <label htmlFor={id} className="block pl-1 text-sm font-medium">
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
  const [errorSource, setErrorSource] = useState<"contact" | "buy" | null>(
    null,
  );
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBuying, setIsBuying] = useState(false);

  const price = mobileCompatibility
    ? BASE_PRICE + MOBILE_COMPATIBILITY_PRICE
    : BASE_PRICE;

  function showError(message: string, source: "contact" | "buy") {
    setError(message);
    setErrorSource(source);
    setSuccess(false);
  }

  function clearFeedback() {
    setError("");
    setErrorSource(null);
    setSuccess(false);
  }

  const handleErrorDismiss = useCallback(() => {
    setError("");
    setErrorSource(null);
  }, []);

  const handleSuccessDismiss = useCallback(() => {
    setSuccess(false);
  }, []);

  async function handleBuyNow() {
    clearFeedback();

    if (!name.trim()) {
      showError("Please add your name.", "buy");
      return;
    }

    if (!email.trim()) {
      showError("Please add an email.", "buy");
      return;
    }

    if (!isValidEmail(email)) {
      showError("Please enter a valid email address.", "buy");
      return;
    }

    if (!webpage.trim()) {
      showError("Please add your webpage link.", "buy");
      return;
    }

    if (!agreedToTerms) {
      showError(
        "Please agree to the terms & privacy before making a purchase.",
        "buy",
      );
      return;
    }

    setIsBuying(true);

    let redirecting = false;

    try {
      const response = await fetch("/api/checkout", {
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
        showError(
          data.error ?? "Something went wrong. Please try again.",
          "buy",
        );
        return;
      }

      if (data.url) {
        redirecting = true;
        window.location.href = data.url;
        return;
      }

      showError("Something went wrong. Please try again.", "buy");
    } catch {
      showError("Something went wrong. Please try again.", "buy");
    } finally {
      if (!redirecting) {
        setIsBuying(false);
      }
    }
  }

  async function handleGetContacted() {
    clearFeedback();

    if (!email.trim()) {
      showError("Please add an email.", "contact");
      return;
    }

    if (!isValidEmail(email)) {
      showError("Please enter a valid email address.", "contact");
      return;
    }

    if (!agreedToTerms) {
      showError(
        "For legal reasons i cannot accept you information before you have agreed to the terms & privacy.",
        "contact",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "landing",
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
        showError(
          data.error ?? "Something went wrong. Please try again.",
          "contact",
        );
        return;
      }

      setSuccess(true);
    } catch {
      showError("Something went wrong. Please try again.", "contact");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="contact" className="py-5">
      <Container>
        <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
          Did this page get you interested?
        </h2>
        <p className="mt-4 text-center text-muted">
          Get your comprehensive landing page review this week by filling out
          the form below.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-[3fr_1fr] lg:gap-8">
          <form
            className="space-y-4 rounded-2xl bg-foreground/[0.03] p-4 sm:p-5"
            onSubmit={(event) => event.preventDefault()}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <FormField
                id="name"
                label="Name"
                placeholder="Name"
                value={name}
                onChange={setName}
              />
              <FormField
                id="email"
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={setEmail}
              />
              <div className="hidden sm:block">
                <FormField
                  id="company"
                  label="Company Name"
                  placeholder="Company name"
                  value={company}
                  onChange={setCompany}
                />
              </div>
              <div className="hidden sm:block">
                <FormField
                  id="phone"
                  label="Phone Number"
                  type="tel"
                  placeholder="Phone number (optional)"
                  value={phone}
                  onChange={setPhone}
                />
              </div>
            </div>

            <FormField
              id="webpage"
              label="Webpage"
              type="url"
              placeholder="https://example.com"
              value={webpage}
              onChange={setWebpage}
            />

            <FormField
              id="message"
              label="Message"
              placeholder="Optional message (e.g. I'm planning on changing the prices next month)"
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
                  Add review for mobile functionality (
                  {MOBILE_COMPATIBILITY_PRICE}$)
                </span>
              </label>

              <div className="flex items-start gap-3 text-sm">
                <input
                  id="terms-agreement"
                  type="checkbox"
                  name="terms"
                  checked={agreedToTerms}
                  onChange={(event) => setAgreedToTerms(event.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-border accent-foreground"
                />
                <p>
                  <label htmlFor="terms-agreement" className="cursor-pointer">
                    By submitting my information i agree to the{" "}
                  </label>
                  <Link
                    href="/tp"
                    className="text-foreground underline transition-colors hover:opacity-80"
                  >
                    terms &amp; privacy
                  </Link>{" "}
                  <label
                    htmlFor="terms-agreement"
                    className="cursor-pointer"
                  ></label>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-start justify-end gap-4 pt-2">
              <div className="relative">
                {error && errorSource === "contact" ? (
                  <FeedbackBubble
                    message={error}
                    onDismiss={handleErrorDismiss}
                  />
                ) : null}
                {success ? (
                  <FeedbackBubble
                    message="Message sent. I will get back to you as soon as possible."
                    variant="success"
                    onDismiss={handleSuccessDismiss}
                  />
                ) : null}
                <GetContactedButton
                  onClick={handleGetContacted}
                  isLoading={isSubmitting}
                  disabled={isBuying}
                />
              </div>
              <BuyNowButton
                price={price}
                errorMessage={
                  error && errorSource === "buy" ? error : undefined
                }
                onErrorDismiss={handleErrorDismiss}
                onClick={handleBuyNow}
                isLoading={isBuying}
                disabled={isSubmitting}
              />
            </div>
          </form>

          <aside className="hidden flex-col lg:flex">
            <div className="flex w-full flex-col items-center overflow-hidden rounded-2xl border-2 border-secondary bg-background p-4 text-center sm:p-5">
              <div className="relative aspect-square w-48 overflow-hidden rounded-full border-2 border-secondary sm:w-56">
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
                <p className="mt-1 text-sm text-muted">
                  Freelance Web Designer
                  <br />
                  <a
                    href="mailto:primary@magnuskongskov.dk"
                    className="text-foreground underline transition-colors hover:opacity-80"
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
