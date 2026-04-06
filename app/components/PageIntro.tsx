interface PageIntroProps {
  eyebrow: string;
  title: string;
  description: string;
}

export default function PageIntro({ eyebrow, title, description }: PageIntroProps) {
  return (
    <section className="relative pt-32">
      <div className="mx-auto max-w-5xl px-6 text-center lg:px-8">
        <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">{eyebrow}</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
          {title}
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-slate-400">
          {description}
        </p>
      </div>
    </section>
  );
}