import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type ContactRequestBody = {
  name?: string;
  email?: string;
  company?: string;
  phone?: string;
  url?: string;
  message?: string;
  phoneIncluded?: boolean;
  agreedToTerms?: boolean;
};

function formatField(value: string | undefined): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : "blank";
}

function buildEmailBody(data: ContactRequestBody): string {
  return [
    "Type: WebsiteInputFormContactRequest",
    `Name: ${formatField(data.name)}`,
    `Email: ${formatField(data.email)}`,
    `Company Name: ${formatField(data.company)}`,
    `Phone: ${formatField(data.phone)}`,
    `URL: ${formatField(data.url)}`,
    `Message: ${formatField(data.message)}`,
    `Phone included: ${data.phoneIncluded ?? false}`,
    `Agreed to terms: ${data.agreedToTerms ?? false}`,
  ].join("\n");
}

export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: "Email service is not configured." },
      { status: 500 },
    );
  }

  let body: ContactRequestBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const email = body.email?.trim();

  if (!email) {
    return NextResponse.json(
      { error: "Please add an email." },
      { status: 400 },
    );
  }

  if (!body.agreedToTerms) {
    return NextResponse.json(
      {
        error:
          "For legal reasons i cannot accept you information before you have agreed to the terms & privacy.",
      },
      { status: 400 },
    );
  }

  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "contactform@magnuskongskov.dk",
    to: "primary@magnuskongskov.dk",
    subject: "Website Contact Request",
    text: buildEmailBody(body),
  });

  if (error) {
    return NextResponse.json(
      { error: "Failed to send email. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
