import Container from "@/components/Container";
import PhoneNumberModal from "@/components/PhoneNumberModal";
import Link from "next/link";

const X_PROFILE_URL = "https://x.com/";

function XIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5 fill-current"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <Container className="grid gap-10 sm:grid-cols-3 sm:items-start sm:gap-8">
        <div className="order-1 text-sm text-muted">
          <p className="font-medium text-foreground">Company Information:</p>
          <p className="mt-2">Company Legal Name: Kongzkov</p>
          <p>VAT-number: DK44571269</p>
          <p>
            Mail:{" "}
            <a
              href="mailto:Primary@magnuskongskov.dk"
              className="transition-colors hover:text-foreground"
            >
              Primary@magnuskongskov.dk
            </a>
          </p>
          <p>
            Phone: <PhoneNumberModal />
          </p>
          <p>Adress: Teglværksgade 17. 2. tv. 8000 Aarhus C</p>
        </div>

        <div className="order-3 flex justify-center sm:order-2 sm:justify-center">
          <a
            href="https://x.com/MagnusKongskov"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted transition-colors hover:text-foreground"
            aria-label="X (formerly Twitter)"
          >
            <XIcon />
          </a>
        </div>

        <div className="order-2 text-sm sm:order-3 sm:text-right">
          <Link
            href="/tp"
            className="text-muted transition-colors hover:text-foreground"
          >
            Terms &amp; Privacy
          </Link>
        </div>
      </Container>
    </footer>
  );
}
