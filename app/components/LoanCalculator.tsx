"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

// ── Calculation ───────────────────────────────────────────────────────────────
// M = P × [r(1+r)^n] / [(1+r)^n − 1]
// P = วงเงินกู้, r = ดอกเบี้ยรายเดือน, n = จำนวนงวด

function calcMonthlyPayment(principal: number, annualRate: number, years: number): number {
  if (principal <= 0 || annualRate <= 0 || years <= 0) return 0;
  const r = annualRate / 100 / 12;
  const n = years * 12;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

function fmt(n: number, decimals = 0): string {
  return n.toLocaleString("th-TH", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

const DEFAULT = { principal: 2000000, years: 40, rate: 6.145 };

// ── Field Input ───────────────────────────────────────────────────────────────
function LoanField({
  label,
  value,
  unit,
  placeholder,
  step,
  onChange,
}: {
  label: string;
  value: string;
  unit: string;
  placeholder: string;
  step?: number;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="flex items-center rounded-lg border border-gray-200 bg-white transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
        <input
          type="number"
          value={value}
          placeholder={placeholder}
          step={step}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent px-4 py-3 text-right text-base font-medium text-gray-700 outline-none placeholder:text-gray-300 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <span className="shrink-0 border-l border-gray-100 px-3 py-3 text-sm text-gray-400">
          {unit}
        </span>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function LoanCalculator() {
  const [principal, setPrincipal] = useState("");
  const [years, setYears] = useState("");
  const [rate, setRate] = useState("");
  const [result, setResult] = useState<{
    monthly: number;
    total: number;
    interest: number;
  } | null>(null);

  const effectivePrincipal = principal ? Number(principal) : DEFAULT.principal;
  const effectiveYears = years ? Number(years) : DEFAULT.years;
  const effectiveRate = rate ? Number(rate) : DEFAULT.rate;

  const handleCalculate = () => {
    const monthly = calcMonthlyPayment(effectivePrincipal, effectiveRate, effectiveYears);
    const total = monthly * effectiveYears * 12;
    const interest = total - effectivePrincipal;
    setResult({ monthly, total, interest });
  };

  const handleReset = () => {
    setPrincipal("");
    setYears("");
    setRate("");
    setResult(null);
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:py-24">
      {/* Heading */}
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-bold text-primary md:text-4xl">
          คำนวณวงเงินที่สามารถกู้ได้
        </h2>
        <p className="mt-2 text-sm text-gray-500 md:text-base">
          ประมาณการยอดผ่อนชำระต่อเดือน ขึ้นอยู่กับวงเงินและระยะเวลาที่ขอกู้
        </p>
      </div>

      <div className="flex flex-col items-center gap-10 md:flex-row md:items-start">
        {/* ── Left: Form ── */}
        <div className="w-full md:w-2/5">
          <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <LoanField
              label="จำนวนเงินที่ขอกู้"
              value={principal}
              unit="บาท"
              placeholder={fmt(DEFAULT.principal)}
              step={100000}
              onChange={setPrincipal}
            />
            <LoanField
              label="ระยะเวลาที่ขอกู้"
              value={years}
              unit="ปี"
              placeholder={String(DEFAULT.years)}
              step={1}
              onChange={setYears}
            />
            <LoanField
              label="อัตราดอกเบี้ยตามประกาศ"
              value={rate}
              unit="%"
              placeholder={String(DEFAULT.rate)}
              step={0.001}
              onChange={setRate}
            />

            {/* Reset */}
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 text-sm font-medium text-primary transition hover:text-primary/70"
            >
              <RotateCcw size={14} />
              รีเซ็ตค่า
            </button>

            {/* Calculate button */}
            <button
              type="button"
              onClick={handleCalculate}
              className="w-full rounded-xl bg-primary py-3.5 text-base font-semibold text-white transition hover:bg-primary/90 active:scale-[0.98]"
            >
              คำนวณ
            </button>

            {/* Result */}
            {result !== null && result.monthly > 0 && (
              <div className="space-y-3 rounded-xl bg-primary/5 p-4">
                <div>
                  <p className="text-xs text-gray-500">ผ่อนชำระต่อเดือน (ประมาณ)</p>
                  <p className="text-2xl font-bold text-primary">
                    {fmt(result.monthly, 2)}
                    <span className="ml-1 text-base font-normal text-gray-500">บาท</span>
                  </p>
                </div>
                <p className="text-[11px] text-gray-400">
                  * คำนวณจาก {fmt(effectivePrincipal)} บาท / {effectiveYears} ปี / {effectiveRate}% ต่อปี
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Right: Lottie ── */}
        <div className="flex w-full items-center justify-center md:w-3/5">
          <DotLottieReact
            src="https://lottie.host/e8cfe9a9-4914-438b-a857-989330f6021f/un25PSzTR9.lottie"
            loop
            autoplay
          />
        </div>
      </div>
    </section>
  );
}
