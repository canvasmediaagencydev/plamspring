"use client";

import { FiDownload } from "react-icons/fi";

interface ProjectInfoProps {
  description: string;
  highlights?: string[];
  downloadUrl?: string;
}

export default function ProjectInfo({
  description,
  highlights = [],
  downloadUrl,
}: ProjectInfoProps) {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12 md:py-20">
      {/* Section heading */}
      <div className="mb-8 text-center md:mb-12">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-gray-400 md:text-sm">
          Project Information
        </p>
        <h2 className="text-2xl font-bold text-primary md:text-4xl">
          ข้อมูลโครงการ
        </h2>
      </div>

      {/* Description */}
      <div className="mb-10 text-center md:mb-14">
        <p className="whitespace-pre-line text-base leading-relaxed text-gray-600 md:text-lg">
          {description}
        </p>
      </div>

      {/* Highlights grid */}
      {highlights.length > 0 && (
        <div className="mb-10 grid grid-cols-2 gap-4 md:mb-14 md:grid-cols-4 md:gap-6">
          
        </div>
      )}

      {/* Download button */}
      {downloadUrl && (
        <div className="flex justify-center">
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 rounded-full border-2 border-primary bg-white px-6 py-3 text-sm font-semibold text-primary shadow-sm transition-all duration-300 hover:bg-primary hover:text-white hover:shadow-lg md:px-8 md:py-4 md:text-base"
          >
            <FiDownload className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
            <span>ดาวน์โหลดแผนบ้านและ ข้อมูลโครงการเพิ่มเติม</span>
          </a>
        </div>
      )}
    </section>
  );
}
