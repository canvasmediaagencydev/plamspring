import Navbar from "../../components/Navbar";
import HeroSection from "../../components/HeroSection";
import Footer from "../../components/Footer";

export const metadata = {
  title: "ส่งข้อมูลเรียบร้อย | Palm Springs",
};

export default function SuccessPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />

        <section className="w-full bg-white py-16 md:py-24">
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-10 px-6 text-center">

            {/* Heading */}
            <h1 className="text-2xl font-bold leading-snug text-primary md:text-4xl">
              ทางบริษัท PALM SPRINGS PLACE
              <br />
              ได้รับข้อมูลของท่านเรียบร้อย
            </h1>

            {/* Chevron + Checkmark row */}
            <div className="flex items-center gap-6">

              {/* Green checkmark circle */}
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#4CD964] md:h-36 md:w-36">
                <svg viewBox="0 0 24 24" fill="none" className="h-14 w-14 md:h-18 md:w-18" aria-hidden="true">
                  <path
                    d="M5 13l4 4L19 7"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* Sub text */}
            <div className="flex flex-col gap-1">
              <p className="text-base text-gray-500 md:text-lg">
                ทางทีมงานจะติดต่อกลับภายใน 24 ชม.
              </p>
              <p className="text-base text-gray-500 md:text-lg">
                ขอขอบพระคุณเป็นอย่างสูงสำหรับความไว้วางใจ
              </p>
            </div>

            {/* Tagline */}
            <p className="text-3xl font-bold italic leading-snug text-primary md:text-5xl">
              &ldquo;เลือกปาล์มสปริงส์
              <br />
              เพื่อชีวิตที่ดีกว่า&rdquo;
            </p>

          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
