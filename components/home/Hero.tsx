import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Video Background - Server-rendered for immediate display */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover bg-brand-black"
      >
        <source src="/videos/hero-videos.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/70" />
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="font-orbitron text-4xl md:text-5xl lg:text-6xl font-bold text-brand-white text-center">
          Votre prochain véhicule vous attend.
        </h1>
        <p className="font-inter text-lg md:text-xl text-brand-gray-light mt-4 text-center">
          Acheter ou vendre autrement
        </p>
        <Link
          href="/stock"
          className="mt-8 font-orbitron text-sm font-semibold px-8 py-3 bg-brand-orange text-brand-black rounded-full hover:bg-brand-orange/90 transition-all duration-300"
        >
          Voir notre stock
        </Link>
      </div>
    </section>
  );
}
