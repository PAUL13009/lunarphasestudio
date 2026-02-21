export default function Contact() {
  return (
    <section id="contact" className="bg-[#0a0a0a] px-6 py-28 lg:px-10 lg:py-40">
      <div className="mx-auto max-w-[1400px]">
        {/* Title */}
        <h2 className="mb-20 text-5xl font-bold uppercase tracking-tight text-white sm:text-6xl lg:text-8xl">
          Contactez-nous
        </h2>

        <div className="grid gap-16 lg:grid-cols-2">
          {/* Left column - description + contact info */}
          <div>
            <p className="mb-12 max-w-md text-base leading-relaxed text-white/50 lg:text-lg">
              Vous avez un projet en tête ? Parlons-en. Nous sommes disponibles
              pour discuter de vos ambitions digitales et vous accompagner dans
              leur réalisation.
            </p>

            <div className="inline-flex flex-col items-center">
              <div className="flex flex-wrap justify-center gap-8">
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 text-white/30" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                  </svg>
                  <span className="text-sm text-white/50">+33 6 00 00 00 00</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 text-white/30" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  <span className="text-sm text-white/50">hello@lunarphasestudio.fr</span>
                </div>
              </div>

              {/* Social links */}
              <div className="mt-10 flex items-center gap-8">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity hover:opacity-80"
                aria-label="Instagram"
              >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <defs>
                    <radialGradient id="ig-gradient" cx="30%" cy="107%" r="150%">
                      <stop offset="0%" stopColor="#fdf497" />
                      <stop offset="5%" stopColor="#fdf497" />
                      <stop offset="45%" stopColor="#fd5949" />
                      <stop offset="60%" stopColor="#d6249f" />
                      <stop offset="90%" stopColor="#285AEB" />
                    </radialGradient>
                  </defs>
                  <rect x="2" y="2" width="20" height="20" rx="5" stroke="url(#ig-gradient)" strokeWidth="1.5" fill="none" />
                  <circle cx="12" cy="12" r="4.5" stroke="url(#ig-gradient)" strokeWidth="1.5" fill="none" />
                  <circle cx="17.5" cy="6.5" r="1.2" fill="url(#ig-gradient)" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity hover:opacity-80"
                aria-label="LinkedIn"
              >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="#0A66C2">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              </div>
            </div>
          </div>

          {/* Right column - form */}
          <form className="flex flex-col gap-8">
            <div>
              <input
                type="text"
                name="name"
                placeholder="Name*"
                required
                className="w-full border-b border-white/15 bg-transparent pb-4 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-white/40"
              />
            </div>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email*"
                required
                className="w-full border-b border-white/15 bg-transparent pb-4 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-white/40"
              />
            </div>
            <div>
              <textarea
                name="message"
                rows={3}
                placeholder="Message (Parlez-nous de votre projet)"
                className="w-full resize-none border-b border-white/15 bg-transparent pb-4 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-white/40"
              />
            </div>

            <div className="mt-4">
              <button
                type="submit"
                className="group flex items-center gap-3 text-sm font-medium text-white transition-colors hover:text-white/70"
              >
                <svg className="h-5 w-5 rotate-180 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                </svg>
                Contactez-nous
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
