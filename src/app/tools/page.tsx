"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedContent from "@/components/AnimatedContent";

export default function ToolsPage() {
  return (
    <>
      <Header />

      <main className="relative z-10 min-h-screen bg-black text-white">
        <section className="px-6 pb-20 pt-32 lg:px-10 lg:pb-28 lg:pt-40">
          <div className="mx-auto max-w-[1500px]">
            <AnimatedContent distance={50} duration={0.9} threshold={0.1}>
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.25em] text-white/45">
                Outil confidentiel
              </p>
            </AnimatedContent>

            <AnimatedContent distance={70} duration={1} threshold={0.1} delay={0.05}>
              <h1 className="max-w-[1300px] text-5xl font-bold uppercase leading-[0.88] tracking-tight sm:text-6xl lg:text-8xl">
                Créez des sites à 5 000 € en 60 secondes.
              </h1>
            </AnimatedContent>

            <AnimatedContent distance={45} duration={0.9} threshold={0.1} delay={0.12}>
              <h2 className="mt-8 max-w-4xl text-xl leading-relaxed text-white/70 sm:text-2xl lg:text-3xl">
                J&apos;ai arrêté de coder à la main. J&apos;utilise désormais une IA confidentielle qui
                transforme une simple phrase en une interface web premium, prête à l&apos;emploi.
              </h2>
            </AnimatedContent>

            <AnimatedContent distance={35} duration={0.8} threshold={0.1} delay={0.18}>
              <div className="mt-10">
                <a
                  href="#waitlist-form"
                  className="inline-block border border-white/25 bg-black px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-black"
                >
                  Rejoindre la liste d&apos;attente
                </a>
              </div>
            </AnimatedContent>
          </div>
        </section>

        <section className="px-6 py-20 lg:px-10 lg:py-28">
          <div className="mx-auto max-w-[1500px]">
            <AnimatedContent distance={50} duration={0.9} threshold={0.15}>
              <p className="mb-5 text-base font-bold uppercase tracking-[0.22em] text-white lg:text-xl">
                Pourquoi s&apos;inscrire ?
              </p>
              <h2 className="mb-12 text-4xl font-bold uppercase leading-[0.95] tracking-tight lg:text-6xl">
                Accès privé + avantage immédiat
              </h2>
            </AnimatedContent>

            <div className="grid gap-6 lg:grid-cols-3">
              <AnimatedContent
                distance={40}
                duration={0.8}
                threshold={0.1}
                className="border border-white/10 bg-white/[0.02] p-7 lg:p-9"
              >
                <p className="mb-4 text-2xl">✨</p>
                <h3 className="mb-4 text-2xl font-bold uppercase tracking-tight">
                  Zéro Code
                </h3>
                <p className="text-sm leading-relaxed text-white/70 lg:text-base">
                  Décrivez votre idée, l&apos;IA s&apos;occupe de la structure et du design.
                </p>
              </AnimatedContent>

              <AnimatedContent
                distance={40}
                duration={0.8}
                threshold={0.1}
                delay={0.07}
                className="border border-white/10 bg-white/[0.02] p-7 lg:p-9"
              >
                <p className="mb-4 text-2xl">🎨</p>
                <h3 className="mb-4 text-2xl font-bold uppercase tracking-tight">
                  Standard de Luxe
                </h3>
                <p className="text-sm leading-relaxed text-white/70 lg:text-base">
                  Le même rendu visuel que les agences les plus chères de France.
                </p>
              </AnimatedContent>

              <AnimatedContent
                distance={40}
                duration={0.8}
                threshold={0.1}
                delay={0.14}
                className="border border-white/10 bg-white/[0.02] p-7 lg:p-9"
              >
                <p className="mb-4 text-2xl">🎁</p>
                <h3 className="mb-4 text-2xl font-bold uppercase tracking-tight">
                  Pack de Bienvenue
                </h3>
                <p className="text-sm leading-relaxed text-white/70 lg:text-base">
                  En vous inscrivant, vous recevrez mes 10 Prompts Magiques personnels pour
                  obtenir un résultat parfait dès le premier essai.
                </p>
              </AnimatedContent>
            </div>
          </div>
        </section>

        <section id="waitlist-form" className="px-6 pb-32 pt-12 lg:px-10 lg:pb-44">
          <div className="mx-auto max-w-[1500px] border border-white/10 bg-white/[0.02] p-8 lg:p-12">
            <AnimatedContent distance={35} duration={0.85} threshold={0.15}>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-white/45 text-center">
                Liste privée
              </p>
              <h2 className="mx-auto mb-6 max-w-4xl text-center text-4xl font-bold uppercase leading-[0.95] tracking-tight lg:text-6xl">
                Je dévoile le nom de l&apos;outil et j&apos;envoie les accès + les prompts à ma
                liste privée la semaine prochaine.
              </h2>

              <form
                onSubmit={(e) => e.preventDefault()}
                className="mx-auto mt-10 flex w-full max-w-3xl flex-col items-center gap-5"
              >
                <input
                  type="email"
                  placeholder="Entrez votre meilleur email..."
                  className="w-full border border-white/20 bg-black px-6 py-4 text-base text-white outline-none transition-colors placeholder:text-white/30 focus:border-white/45"
                />

                <button
                  type="button"
                  className="cursor-default border border-white/25 bg-black px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white transition-all duration-300"
                  aria-disabled="true"
                >
                  Rejoindre la liste d&apos;attente (gratuit)
                </button>
              </form>

              <p className="mx-auto mt-6 max-w-3xl text-center text-sm leading-relaxed text-white/50 lg:text-base">
                Pas de spam. Inscription gratuite et sans engagement. Vous recevrez l&apos;outil et
                les prompts en avant-première.
              </p>
            </AnimatedContent>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
