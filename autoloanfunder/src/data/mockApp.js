export const mockApplication = {
  id: "APP-90210",
  status: "Pending Stips",
  submittedAt: "2026-03-21T09:14:00Z",
  dealership: { name: "Sunrise Auto Group", city: "Austin, TX" },
  customer: {
    primary: { firstName: "Jane", lastName: "Doe", state: "TX" },
    coBuyer: { firstName: "John", lastName: "Doe" },
  },
  vehicle: {
    year: 2024,
    make: "Toyota",
    model: "Camry",
    trim: "XSE V6",
    mileage: 12450,
    vin: "4T1BZ1HK8MU123456",
  },
  financials: {
    amountFinanced: 34750,
    baseLoan: 31200,
    gap: 895,
    warranty: 2655,
  },
  risk: {
    creditTier: "Tier 1",
    fico: 742,
    ltv: 118,
    pti: 12.4,
    dti: 38.2,
  },
  tasks: [
    { id: 1, label: "Verify Proof of Income", status: "cleared" },
    { id: 2, label: "Validate Insurance Deductible ≤ $500", status: "needs_review" },
    { id: 3, label: "Check Title / Odometer Statement", status: "pending" },
    { id: 4, label: "Confirm GAP Enrollment Form", status: "pending" },
    { id: 5, label: "Verify Driver's License (Primary)", status: "cleared" },
    { id: 6, label: "Verify Driver's License (Co-Buyer)", status: "pending" },
  ],
  aiSummaries: {
    documents:
      "AI confirms the uploaded paystub matches the stated gross income of $5,000/mo. No discrepancies found between the W-2 and paystub dates. Insurance binder deductible is listed at $750 — flagged for funder review against policy maximum.",
    deal:
      "High LTV (118%) driven by negative equity roll-in of approximately $3,550. However, strong PTI (12.4%) and verified primary residence ownership mitigate risk. FICO of 742 supports Tier 1 pricing. DTI of 38.2% is within acceptable threshold. Overall deal health is moderate with one open stipulation.",
  },
  decisionLog: [
    { id: 1, timestamp: "2026-03-21T09:14:00Z", actor: "System", action: "Application submitted by Sunrise Auto Group" },
    { id: 2, timestamp: "2026-03-21T09:15:30Z", actor: "AI Engine", action: "Document analysis complete — 1 flag raised on insurance deductible" },
    { id: 3, timestamp: "2026-03-21T10:02:14Z", actor: "J. Martinez", action: "Proof of Income — marked Cleared" },
    { id: 4, timestamp: "2026-03-21T10:04:55Z", actor: "J. Martinez", action: "Driver's License (Primary) — marked Cleared" },
  ],
};
