import PalmTreeIcon from "./PalmTreeIcon";

interface SectionBlockProps {
  title: string;
  children: React.ReactNode;
}

function SectionBlock({ title, children }: SectionBlockProps) {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="rounded-full border-2 border-primary px-10 py-2">
        <h2 className="text-lg font-bold tracking-widest text-primary">{title}</h2>
      </div>
      <div className="max-w-2xl text-sm leading-relaxed text-primary md:text-base">
        {children}
      </div>
    </div>
  );
}

export default function AboutContent() {
  return (
    <section className="w-full bg-white py-12 md:py-20">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-12 px-6 md:gap-16">
        {/* Brand Logo */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold tracking-widest text-primary md:text-5xl">
              PALM
            </span>
            <PalmTreeIcon size={40} />
            <span className="text-3xl font-bold tracking-widest text-primary md:text-5xl">
              SPRINGS
            </span>
          </div>
        </div>

        {/* History */}
        <SectionBlock title="HISTORY">
          <p>
            เป็นบริษัทที่ประกอบธุรกิจพัฒนาอสังหาริมทรัพย์ที่อยู่อาศัย
            จดทะเบียนเมื่อวันที่ 17 กรกฎาคม พ.ศ. 2532 โดยนาย
            &ldquo;บุญทรัพย์ สุนทรพิทักษ์ เจ้าของ&rdquo;
            มีทุนจดทะเบียน 20 ล้านบาท ในปี พ.ศ. 2547
          </p>
          <p className="mt-2">
            ปัจจุบันเปลี่ยนชื่อ &ldquo;บริษัท เดียมอนด์คลัส จำกัด&rdquo; เป็น
            &ldquo;บริษัท ปาล์ม สปริงส์ แลนด์ แอนด์ โฮม จำกัด&rdquo;
            มีประสบการณ์ในด้านการขาย และบริหารงานมากกว่า 20 ปี
            มีทั้งหมด 230 ล้านบาท
          </p>
        </SectionBlock>

        {/* Divider */}
        <hr className="w-full border-gray-200" />

        {/* Vision */}
        <SectionBlock title="VISION">
          <p>
            เรา คือ ผู้นำด้านอสังหาริมทรัพย์ที่เพื่อมุ่งมั่นสร้างชีวิตความเป็นอยู่ที่ดี
            ให้กับสังคมไทยและผู้ที่ต้องการรักไทย
          </p>
        </SectionBlock>

        {/* Divider */}
        <hr className="w-full border-gray-200" />

        {/* Mission */}
        <SectionBlock title="MISSION">
          <p>
            มุ่งมั่นพัฒนาโครงการที่อยู่อาศัยที่มีคุณภาพในราคาที่เป็นธรรม
            เพื่อตอบสนองความต้องการของลูกค้าทุกระดับ
            พร้อมทั้งให้บริการหลังการขายที่ดีเยี่ยม
            เพื่อให้ลูกค้าได้รับความพึงพอใจสูงสุด
            และเพื่อสร้างสรรค์สังคมที่น่าอยู่อาศัยอย่างยั่งยืน
          </p>
        </SectionBlock>
      </div>
    </section>
  );
}
