import Link from "next/link";
import type { TransactionDocument } from "@/models/User";
import { color1 } from "@/components/pw/colors";

type ProfileTransactionsProps = {
  transactions: TransactionDocument[];
};

function formatTransactionDate(time: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(time));
}

export default function ProfileTransactions({
  transactions,
}: ProfileTransactionsProps) {
  const sortedTransactions = [...transactions].sort(
    (left, right) => new Date(right.time).getTime() - new Date(left.time).getTime(),
  );

  return (
    <section
      className="rounded-2xl border p-6 sm:p-8"
      style={{ borderColor: color1, backgroundColor: `${color1}10` }}
    >
      <h2 className="text-xl font-semibold text-white">Transactions</h2>

      {sortedTransactions.length === 0 ? (
        <p className="mt-4 text-sm text-white/60">No transactions yet.</p>
      ) : (
        <ul className="mt-6 space-y-4">
          {sortedTransactions.map((transaction, index) => {
            const invoiceHref = transaction.stripeSessionId
              ? `/api/account/transactions/${transaction.stripeSessionId}/invoice`
              : null;

            return (
              <li
                key={`${transaction.time}-${index}`}
                className="rounded-xl border border-white/10 bg-[#0a0a0a] p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">
                      {transaction.amount}
                    </p>
                    <p className="mt-1 text-sm text-white/55">
                      {formatTransactionDate(transaction.time)}
                    </p>
                    <p
                      className={`mt-1 text-xs font-medium uppercase tracking-wide ${
                        transaction.successful
                          ? "text-emerald-400"
                          : "text-red-300"
                      }`}
                    >
                      {transaction.successful ? "Successful" : "Failed"}
                    </p>
                  </div>

                  {transaction.successful && invoiceHref ? (
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={invoiceHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition-colors hover:border-white/30 hover:bg-white/[0.04]"
                      >
                        View invoice
                      </Link>
                      <a
                        href={invoiceHref}
                        download
                        className="rounded-full px-4 py-2 text-sm font-semibold text-[#0a0a0a] transition-opacity hover:opacity-90"
                        style={{ backgroundColor: color1 }}
                      >
                        Download invoice
                      </a>
                    </div>
                  ) : transaction.successful ? (
                    <p className="text-sm text-white/45">Invoice unavailable</p>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
