import Container from "@/components/Container";
import Link from "next/link";

const contactEmail = "primary@Magnuskongskov.dk";

function ContentCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-border bg-background p-6">
      <h3 className="font-semibold">{title}</h3>
      <div className="mt-2 text-sm text-muted">{children}</div>
    </article>
  );
}

function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="text-foreground transition-colors hover:opacity-80"
    >
      {children}
    </a>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 list-disc space-y-2 pl-5">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export default function TermsAndPrivacy() {
  return (
    <>
      <section className="py-24 sm:py-32">
        <Container className="text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-accent">
            Legal
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Terms &amp; Privacy
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
            Terms of purchase and privacy notice for Kongskov Web Services.
          </p>
        </Container>
      </section>

      <section className="border-t border-border bg-foreground/[0.02] py-24">
        <Container>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Company &amp; Contact Information
          </h2>
          <div className="mt-12 rounded-2xl border border-border bg-background p-6">
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="font-medium text-foreground">
                  Legal company name
                </dt>
                <dd className="mt-1 text-muted">Kongzkov</dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">VAT-number</dt>
                <dd className="mt-1 text-muted">DK44571269</dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">
                  Company address
                </dt>
                <dd className="mt-1 text-muted">
                  Teglværksgade 17, 2. Tv, 8000 Aarhus C, Denmark
                </dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">Website</dt>
                <dd className="mt-1">
                  <TextLink href="https://magnuskongskov.dk">
                    magnuskongskov.dk
                  </TextLink>
                </dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">Mail</dt>
                <dd className="mt-1">
                  <TextLink href={`mailto:${contactEmail}`}>
                    {contactEmail}
                  </TextLink>
                </dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">Phone</dt>
                <dd className="mt-1 text-muted">
                  <TextLink href="tel:+4530494119">+45 30 49 41 19</TextLink>{" "}
                  (This number is legally protected against sales calls in
                  Denmark)
                </dd>
              </div>
            </dl>
          </div>
        </Container>
      </section>

      <section className="py-24">
        <Container>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Terms of Purchase
          </h2>
          <p className="mt-4 max-w-2xl text-muted">
            This document contains the terms of conditions for a purchased
            landing page review on magnuskongskov.com.
          </p>

          <div className="mt-12 space-y-6">
            <ContentCard title="The product">
              <p>
                The product consist of a PDF-file, which usually consist of
                between 8 and 12 pages. (Please note that a well-designed
                landing page will have less improvement suggestions and the
                report therefore will be shorter. A less well-designed page will
                have more improvement suggestions and therefore the report may
                be longer.)
              </p>
              <p className="mt-3">
                The product will usually contain the following content:
              </p>
              <BulletList
                items={[
                  "Overall Content Review — Review of product explanation (Does the landing page do a good job of explaining the product being sold?); Amount of content (Does the landing page have too much irrelevant text or too little to fill the landing page?); Flow of content (Does the order of the content create a natural flow towards the button of the page?)",
                  "Overall Composition Review — Flow of composition (Does the visual composition follow the natural eye flow of a visitor?)",
                  "Sectional Content Review — Word for word analysis for all sections of the landing page; Choice of illustrations.",
                  "Sectional Composition Review — Positioning of text and illustrations.",
                  "Graphical Design Notes — Notes on whether design is too generic; Notes on whether the design uses complimentary colors; Notes on other possible bad design choices.",
                  "Summary of suggestions — A list of all suggested improvements.",
                ]}
              />
              <p className="mt-3">
                Please note that the primary purpose of the product is suggesting
                improvements for the content and composition of the website. The
                report will include notes and suggestions on the graphical design
                in cases where bad graphical design choices has been made.
              </p>
            </ContentCard>

            <ContentCard title="Additional review for mobile">
              <p>
                The review for mobile is sold as an additional service, when
                purchasing the product. The review contains the same content as
                listed in section 1 to 4 in &ldquo;The product&rdquo; section,
                but when viewing the webpage from a mobile device.
              </p>
              <p className="mt-3">
                The mobile review is intended for buyers who already have made
                their website compatible with mobile, but want to optimize
                conversions on mobile.
              </p>
              <p className="mt-3">
                When bought together the mobile review will be part of the same
                document as the other content.
              </p>
              <p className="mt-3">
                If the buyer did not originally opt in for a mobile review, but
                has changed their mind, they can contact{" "}
                <TextLink href={`mailto:${contactEmail}`}>
                  {contactEmail}
                </TextLink>{" "}
                and have the mobile review added as an additional service. The
                cost of the additional service is 140 USD.
              </p>
            </ContentCard>

            <ContentCard title="Payment">
              <BulletList
                items={[
                  "All payments are made using Stripe as a payment processor.",
                  "All payments are made up front.",
                  "All payments are made in USD unless otherwise specified.",
                  "An invoice will be sent to the mail specified when ordering the product.",
                ]}
              />
            </ContentCard>

            <ContentCard title="Delivery Time">
              <p>
                The product is delivered at latest at noon UTC on the 14th day
                after order. E.g. if an order is made on 3rd of July at 17:18
                UTC it will be delivered at latest at 18th of July at 12:00 UTC.
                (Please note that most products are delivered within 5 days)
              </p>
              <p className="mt-3">
                In case the product is not delivered on time the buyer will be
                entitled to a full refund.
              </p>
            </ContentCard>

            <ContentCard title="Delivery Method">
              <p>
                The product is delivered as an PDF-file to the email address
                provided at the time of purchase.
              </p>
            </ContentCard>

            <ContentCard title="Waiver of the 14 day withdrawal period within the EU">
              <p>
                Please note that the 14-day cooling-period does not apply to the
                product, as it falls under the category of: Goods made to order
                or clearly personalized goods.
              </p>
              <p className="mt-3">
                For refunds please check the Refund policy.
              </p>
            </ContentCard>

            <ContentCard title="Refund policy">
              <p>
                Refunds are not available once the product is under construction
                or when the product has already been delivered. If you want to
                request a refund and you have not yet received the product
                please contact{" "}
                <TextLink href={`mailto:${contactEmail}`}>
                  {contactEmail}
                </TextLink>{" "}
                as soon as possible. Refunds are then given on a discretionary
                basis.
              </p>
            </ContentCard>

            <ContentCard title="Disputes">
              <p>All disputes are handled in a court of law.</p>
            </ContentCard>
          </div>
        </Container>
      </section>

      <section className="border-t border-border bg-foreground/[0.02] py-24">
        <Container>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Privacy Notice
          </h2>
          <p className="mt-4 max-w-2xl text-muted">
            Kongskov Web Services is a web design agency. This privacy notice
            explains how data submitted through our webpage forms are handled.
          </p>

          <div className="mt-12 space-y-6">
            <ContentCard title="Data We Collect">
              <p>We process the following personal data:</p>
              <BulletList
                items={[
                  "Contact information — Name, Mail, Phone Number, Billing Address",
                  "Company Information — Company Webpage",
                  "Transaction Data (processed via secure third-party providers) — Purchase history, Payment details",
                ]}
              />
            </ContentCard>

            <ContentCard title="How We Collect Data">
              <p>We collect data:</p>
              <BulletList
                items={[
                  "When you use the contact form on our website.",
                  "From our third part payment processor, with your consent.",
                ]}
              />
            </ContentCard>

            <ContentCard title="Puposes and Legal Basis">
              <p>We process your data for the following purpose:</p>
              <BulletList
                items={[
                  "To fulfill your orders (contractual necessity): Process payments, delivery purposes.",
                  "To send marketing communications (consent): Contact you regarding our product, if you opt in.",
                  "To comply with legal obligations (legal obligation): Maintain records for tax purposes.",
                ]}
              />
            </ContentCard>

            <ContentCard title="We share your data">
              <p>We share your data with:</p>
              <BulletList items={["Service providers: Payment processor"]} />
            </ContentCard>

            <ContentCard title="Data Retention">
              <BulletList
                items={[
                  "Transaction data is kept for 7 years to comply with tax laws.",
                  "Marketing data is kept until you withdraw consent.",
                ]}
              />
            </ContentCard>

            <ContentCard title="Your Rights">
              <p>Under GDPR, you have the right to:</p>
              <BulletList
                items={[
                  "Access your personal data.",
                  "Request correction or erasure of your data.",
                  "Restrict or object to processing.",
                  "Request data portability.",
                  "Withdraw consent for marketing at any time.",
                ]}
              />
              <p className="mt-3">
                To exercise these rights, contact us at{" "}
                <TextLink href={`mailto:${contactEmail}`}>
                  {contactEmail}
                </TextLink>
                . You may also lodge a complaint with your local data protection
                authority.
              </p>
            </ContentCard>
          </div>
        </Container>
      </section>

      <section className="py-24">
        <Container>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Download documents
          </h2>
          <p className="mt-4 max-w-2xl text-muted">
            You can download PDF versions of these documents below.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            <Link
              href="/documents/terms-of-service.pdf"
              download
              className="group overflow-hidden rounded-2xl border border-border bg-foreground/[0.03] p-6 transition-shadow hover:shadow-md"
            >
              <p className="text-xs font-medium uppercase tracking-wider text-accent">
                PDF
              </p>
              <h3 className="mt-1 font-semibold">Terms of Purchase</h3>
              <p className="mt-2 text-sm text-muted">
                Download the full terms of purchase document.
              </p>
            </Link>
            <Link
              href="/documents/privacy-notice.pdf"
              download
              className="group overflow-hidden rounded-2xl border border-border bg-foreground/[0.03] p-6 transition-shadow hover:shadow-md"
            >
              <p className="text-xs font-medium uppercase tracking-wider text-accent">
                PDF
              </p>
              <h3 className="mt-1 font-semibold">Privacy Notice</h3>
              <p className="mt-2 text-sm text-muted">
                Download the full privacy notice document.
              </p>
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
