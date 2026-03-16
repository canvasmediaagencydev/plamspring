"use client";

import { useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

// ── Loan calculation ──────────────────────────────────────────────────────────
// สูตร: วงเงินกู้สูงสุด = ผ่อนได้ต่อเดือน × [ (1-(1+r)^-n) / r ]
// r = อัตราดอกเบี้ยรายเดือน (ใช้ 6.5% ต่อปี)
// n = จำนวนงวด (ปี × 12)
// ธนาคารอนุมัติ DSR ไม่เกิน 40% ของรายได้

const ANNUAL_RATE = 0.065; // 6.5% ต่อปี
const DSR_RATIO = 0.4; // 40%

function calcMaxLoan(income: number, debt: number, years: number): number {
  if (income <= 0 || years <= 0) return 0;
  const availableMonthly = income * DSR_RATIO - debt;
  if (availableMonthly <= 0) return 0;
  const r = ANNUAL_RATE / 12;
  const n = years * 12;
  const pv = availableMonthly * ((1 - Math.pow(1 + r, -n)) / r);
  return Math.max(0, pv);
}

function formatTHB(amount: number): string {
  return amount.toLocaleString("th-TH", { maximumFractionDigits: 0 });
}

// ── Number Input ──────────────────────────────────────────────────────────────
interface NumberInputProps {
  label: string;
  value: number;
  unit: string;
  step: number;
  max?: number;
  onChange: (v: number) => void;
  hint?: string;
}

function NumberInput({ label, value, unit, step, max, onChange, hint }: NumberInputProps) {
  const dec = () => onChange(Math.max(0, value - step));
  const inc = () => onChange(max !== undefined ? Math.min(max, value + step) : value + step);

  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-600 md:text-base">{label}</p>
      <div className="flex items-center gap-3 border-b-2 border-gray-300 pb-2 focus-within:border-primary">
        {/* − button */}
        <button
          type="button"
          onClick={dec}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-300 text-gray-500 transition hover:border-primary hover:text-primary"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M19 13H5v-2h14v2z"/></svg>
        </button>

        {/* Text input */}
        <input
          type="number"
          min={0}
          max={max}
          value={value || ""}
          placeholder="0"
          onChange={(e) => {
            let v = Math.max(0, Number(e.target.value));
            if (max !== undefined) v = Math.min(max, v);
            onChange(v);
          }}
          className="w-full bg-transparent text-center text-2xl font-bold text-gray-800 outline-none placeholder:font-normal placeholder:text-gray-400 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />

        {/* + button */}
        <button
          type="button"
          onClick={inc}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-300 text-gray-500 transition hover:border-primary hover:text-primary"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
        </button>

        <span className="shrink-0 text-sm text-gray-500 md:text-base">{unit}</span>
      </div>
      {hint && <p className="text-xs text-gray-400 md:text-sm">{hint}</p>}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function LoanCalculator() {
  const [income, setIncome] = useState(20000);
  const [debt, setDebt] = useState(0);
  const [years, setYears] = useState(0);
  const [result, setResult] = useState<number | null>(null);

  const handleCalculate = () => {
    const clampedYears = Math.min(years, 30);
    setYears(clampedYears);
    setResult(calcMaxLoan(income, debt, clampedYears));
  };

  const handleReset = () => {
    setIncome(20000);
    setDebt(0);
    setYears(0);
    setResult(null);
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      {/* Heading */}
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-bold text-primary md:text-4xl">คำนวณวงเงินที่สามารถกู้ได้</h2>
        <p className="mt-2 text-sm text-gray-500 md:text-lg">
          ประมาณการยอดเงินกู้สูงสุด เพื่อที่อยู่อาศัยซึ่งแปรผันและขึ้นอยู่กับรายได้แต่ละบุคคล
        </p>
      </div>

      <div className="flex flex-col items-center gap-10 md:flex-row md:items-start">
        {/* ── Left: Form ── */}
        <div className="w-full space-y-8 md:w-2/5">
          <NumberInput
            label="รายได้ต่อเดือน (รวมรายได้ผู้กู้ร่วม (ถ้ามี))"
            value={income}
            unit="บาท"
            step={1000}
            onChange={setIncome}
          />
          <NumberInput
            label="ภาระหนี้ที่ต้องผ่อนชำระต่อเดือน (ถ้ามี)"
            value={debt}
            unit="บาท"
            step={500}
            onChange={setDebt}
          />
          <NumberInput
            label="ระยะเวลาที่ขอกู้ (ปี)"
            value={years}
            unit="ปี"
            step={1}
            max={30}
            onChange={setYears}
            hint="*สูงสุดไม่ควรเกิน 30 ปี"
          />

          {/* Result */}
          {result !== null && (
            <div className="rounded-xl bg-primary/10 px-5 py-4">
              <p className="text-base text-gray-600 md:text-lg">วงเงินกู้สูงสุดที่ประมาณได้</p>
              <p className="mt-1 text-3xl font-bold text-primary md:text-4xl">
                {formatTHB(result)}
                <span className="ml-2 text-lg font-normal md:text-xl">บาท</span>
              </p>
              <p className="mt-1 text-xs text-gray-400 md:text-sm">
                * คำนวณจากอัตราดอกเบี้ย {(ANNUAL_RATE * 100).toFixed(1)}% ต่อปี และ DSR {DSR_RATIO * 100}%
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleCalculate}
              className="rounded-full bg-[#1a2e6e] px-6 py-2.5 text-base font-semibold text-white transition hover:opacity-90 md:px-8 md:py-3"
            >
              คำนวณเงินกู้
            </button>
            <button
              onClick={handleReset}
              className="rounded-full border border-gray-300 px-6 py-2.5 text-base font-semibold text-gray-700 transition hover:bg-gray-50 md:px-8 md:py-3"
            >
              เริ่มใหม่
            </button>
            <button className="rounded-full bg-[#e31e24] px-6 py-2.5 text-base font-semibold text-white transition hover:opacity-90 md:px-8 md:py-3">
              ติดต่อเรา
            </button>
          </div>
        </div>

        {/* ── Right: Lottie ── */}
        <div className="flex  w-full items-center justify-center md:w-3/5">
          <div className="w-full">
            <DotLottieReact
              src="https://lottie.host/e8cfe9a9-4914-438b-a857-989330f6021f/un25PSzTR9.lottie"
              loop
              autoplay
            />
          </div>
        </div>
      </div>
    </section>
  );
}
