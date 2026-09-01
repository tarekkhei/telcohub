# TelcoHub powered by Coreveo AI

Synthetic frontend mockup of an agentic telecom operations product. Coreveo reconstructs failed business transactions across OSS/BSS systems and drives them from exception to verified outcome.

This is demo data only. Customer identifiers, MSISDNs, operators, financial values and incidents are fictional.

## Run locally

```bash
./run.sh
```

Or:

```bash
npm install
npm run dev
```

Open the printed local URL (typically `http://localhost:5173`).

## Demo path (about 5 minutes)

1. Open **Command Center** and note 147 exceptions / 121 AI diagnosed.
2. Open `EXC-2026-0146` (Mobile Activation Failed).
3. Walk the transaction journey, seven-system correlation, diagnosis and blast radius.
4. Click **Approve & Execute** to simulate remediation.
5. Confirm **VERIFIED** before/after state.
6. Return to the dashboard, then open **AI Insights**.

## Stack

React, TypeScript, Tailwind CSS, Recharts, Lucide, React Router. Mock data lives in `src/data` and is served through `src/services/mockApi.ts` so a REST API can replace it later.
