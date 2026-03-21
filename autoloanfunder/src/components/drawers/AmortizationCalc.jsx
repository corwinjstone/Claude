import { useState } from "react";

function calcMonthly(principal, annualRate, termMonths) {
  if (!principal || !annualRate || !termMonths) return 0;
  const r = annualRate / 100 / 12;
  const n = termMonths;
  if (r === 0) return principal / n;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

function fmt(n) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });
}

export default function AmortizationCalc() {
  const [principal, setPrincipal] = useState("34750");
  const [rate, setRate] = useState("7.49");
  const [term, setTerm] = useState("72");

  const p = parseFloat(principal) || 0;
  const r = parseFloat(rate) || 0;
  const n = parseInt(term) || 0;
  const monthly = calcMonthly(p, r, n);
  const totalPaid = monthly * n;
  const totalInterest = totalPaid - p;

  // Build first 6 rows of amortization table
  const rows = [];
  let balance = p;
  const monthlyRate = r / 100 / 12;
  for (let i = 1; i <= Math.min(6, n) && balance > 0; i++) {
    const interest = balance * monthlyRate;
    const principalPaid = monthly - interest;
    balance = Math.max(0, balance - principalPaid);
    rows.push({ month: i, payment: monthly, principal: principalPaid, interest, balance });
  }

  const inputClass =
    "w-full px-3 py-1.5 text-sm rounded-md border border-[#e9e9e9] bg-white text-[#00132b] outline-none focus:border-[#00132b] focus:ring-1 focus:ring-[#00132b] transition-colors";
  const labelClass = "text-xs text-[#525252] mb-1 block";

  return (
    <div className="p-4 flex flex-col gap-4">
      {/* Inputs */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className={labelClass} style={{ fontFamily: '"Optimist", sans-serif' }}>Principal ($)</label>
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            className={inputClass}
            style={{ fontFamily: '"Optimist", sans-serif' }}
          />
        </div>
        <div>
          <label className={labelClass} style={{ fontFamily: '"Optimist", sans-serif' }}>Rate (%)</label>
          <input
            type="number"
            step="0.01"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className={inputClass}
            style={{ fontFamily: '"Optimist", sans-serif' }}
          />
        </div>
        <div>
          <label className={labelClass} style={{ fontFamily: '"Optimist", sans-serif' }}>Term (mo)</label>
          <input
            type="number"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className={inputClass}
            style={{ fontFamily: '"Optimist", sans-serif' }}
          />
        </div>
      </div>

      {/* Results */}
      <div className="rounded-lg bg-[#00132b] text-white p-4 grid grid-cols-3 gap-3 text-center">
        <div>
          <div className="text-xs text-white/60 mb-1" style={{ fontFamily: '"Optimist", sans-serif' }}>Monthly</div>
          <div className="text-base font-bold" style={{ fontFamily: '"Optimist", sans-serif' }}>{fmt(monthly)}</div>
        </div>
        <div>
          <div className="text-xs text-white/60 mb-1" style={{ fontFamily: '"Optimist", sans-serif' }}>Total Paid</div>
          <div className="text-base font-bold" style={{ fontFamily: '"Optimist", sans-serif' }}>{fmt(totalPaid)}</div>
        </div>
        <div>
          <div className="text-xs text-white/60 mb-1" style={{ fontFamily: '"Optimist", sans-serif' }}>Total Interest</div>
          <div className="text-base font-bold" style={{ fontFamily: '"Optimist", sans-serif' }}>{fmt(totalInterest)}</div>
        </div>
      </div>

      {/* Amortization table */}
      <div>
        <p className="text-xs font-bold text-[#00132b] mb-2" style={{ fontFamily: '"Optimist", sans-serif' }}>
          First 6 Payments
        </p>
        <table className="w-full text-xs" style={{ fontFamily: '"Optimist", sans-serif' }}>
          <thead>
            <tr className="text-[#525252]" style={{ borderBottom: "1px solid #e9e9e9" }}>
              <th className="pb-1.5 text-left font-semibold">#</th>
              <th className="pb-1.5 text-right font-semibold">Payment</th>
              <th className="pb-1.5 text-right font-semibold">Principal</th>
              <th className="pb-1.5 text-right font-semibold">Interest</th>
              <th className="pb-1.5 text-right font-semibold">Balance</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.month} className="text-[#00132b]" style={{ borderBottom: "1px solid #f7f3eb" }}>
                <td className="py-1.5">{row.month}</td>
                <td className="py-1.5 text-right">{fmt(row.payment)}</td>
                <td className="py-1.5 text-right">{fmt(row.principal)}</td>
                <td className="py-1.5 text-right text-[#bf5347]">{fmt(row.interest)}</td>
                <td className="py-1.5 text-right">{fmt(row.balance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
