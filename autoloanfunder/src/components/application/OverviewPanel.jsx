function Card({ title, children }) {
  return (
    <div className="bg-white rounded-lg border border-[#e9e9e9] p-4 flex flex-col gap-3">
      <h3
        className="text-xs font-bold text-[#525252] uppercase tracking-wider"
        style={{ fontFamily: '"Optimist", sans-serif' }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

function Row({ label, value, mono, highlight }) {
  return (
    <div className="flex items-baseline justify-between gap-2 text-sm">
      <span className="text-[#525252] flex-shrink-0" style={{ fontFamily: '"Optimist", sans-serif' }}>
        {label}
      </span>
      <span
        className={`font-bold text-right ${highlight ?? "text-[#00132b]"} ${mono ? "font-mono text-xs" : ""}`}
        style={mono ? {} : { fontFamily: '"Optimist", sans-serif' }}
      >
        {value}
      </span>
    </div>
  );
}

function fmt(n) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 });
}

export default function OverviewPanel({ app }) {
  const { customer, vehicle, financials, risk } = app;

  const ltvColor = risk.ltv > 125 ? "text-[#bf5347]" : risk.ltv > 110 ? "text-amber-600" : "text-[#7a9a01]";
  const dtiColor = risk.dti > 45 ? "text-[#bf5347]" : risk.dti > 40 ? "text-amber-600" : "text-[#7a9a01]";

  return (
    <div className="grid grid-cols-1 ph:grid-cols-2 xl:grid-cols-4 gap-4 p-6">
      {/* Customer */}
      <Card title="Customer">
        <Row label="Primary" value={`${customer.primary.firstName} ${customer.primary.lastName}`} />
        <Row label="Co-Buyer" value={customer.coBuyer ? `${customer.coBuyer.firstName} ${customer.coBuyer.lastName}` : "—"} />
        <Row label="State" value={customer.primary.state} />
      </Card>

      {/* Vehicle */}
      <Card title="Vehicle">
        <Row label="Year / Make" value={`${vehicle.year} ${vehicle.make}`} />
        <Row label="Model / Trim" value={`${vehicle.model} ${vehicle.trim}`} />
        <Row label="Mileage" value={vehicle.mileage.toLocaleString()} />
        <Row label="VIN" value={vehicle.vin} mono />
      </Card>

      {/* Financials */}
      <Card title="Financials">
        <Row label="Amount Financed" value={fmt(financials.amountFinanced)} />
        <Row label="Base Loan" value={fmt(financials.baseLoan)} />
        <Row label="GAP" value={fmt(financials.gap)} />
        <Row label="Warranty" value={fmt(financials.warranty)} />
      </Card>

      {/* Risk Metrics */}
      <Card title="Risk Metrics">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#525252]" style={{ fontFamily: '"Optimist", sans-serif' }}>Credit Tier</span>
          <span
            className="bg-[#d6e8ea] text-[#013d5b] text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ fontFamily: '"Optimist", sans-serif' }}
          >
            {risk.creditTier}
          </span>
        </div>
        <Row label="FICO Score" value={risk.fico} />
        <Row label="LTV" value={`${risk.ltv}%`} highlight={ltvColor} />
        <Row label="PTI" value={`${risk.pti}%`} />
        <Row label="DTI" value={`${risk.dti}%`} highlight={dtiColor} />
      </Card>
    </div>
  );
}
