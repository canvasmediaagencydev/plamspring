/** Two YouTube-style video skeleton cards */

function PlayButton() {
  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 shadow-lg md:h-20 md:w-20">
      {/* Triangle */}
      <svg
        viewBox="0 0 24 24"
        fill="white"
        className="ml-1 h-7 w-7 md:h-9 md:w-9"
        aria-hidden="true"
      >
        <path d="M8 5v14l11-7z" />
      </svg>
    </div>
  );
}

function YoutubeLabel() {
  return (
    <div className="flex items-center gap-2 text-sm font-semibold text-white">
      {/* YouTube icon */}
      <svg viewBox="0 0 24 24" fill="white" className="h-5 w-5" aria-hidden="true">
        <path d="M21.8 8s-.2-1.4-.8-2c-.8-.8-1.6-.8-2-.9C16.8 5 12 5 12 5s-4.8 0-7 .1c-.4.1-1.2.1-2 .9-.6.6-.8 2-.8 2S2 9.6 2 11.2v1.5c0 1.6.2 3.2.2 3.2s.2 1.4.8 2c.8.8 1.8.8 2.2.8C6.6 19 12 19 12 19s4.8 0 7-.2c.4-.1 1.2-.1 2-.9.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.5C22 9.6 21.8 8 21.8 8zM10 15V9l5.5 3-5.5 3z" />
      </svg>
      <span>ดูบน YouTube</span>
    </div>
  );
}

function VideoCard() {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-gray-800 shadow-md">
      {/* Skeleton thumbnail */}
      <div className="relative h-52 w-full bg-gray-300 md:h-72">
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300" />
      </div>

      {/* Play button — centred */}
      <div className="absolute inset-0 flex items-center justify-center">
        <PlayButton />
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-between bg-gray-900/80 px-4 py-2">
        <YoutubeLabel />
      </div>
    </div>
  );
}

export default function OurFamilyVideos() {
  return (
    <section className="w-full bg-white py-6 md:py-10">
      <div className="mx-auto flex max-w-4xl flex-col gap-6 px-6 md:px-12">
        <VideoCard />
        <VideoCard />
      </div>
    </section>
  );
}
