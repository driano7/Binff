import Image from "next/image"
import { MdxArticle } from "@/components/mdx-article"
import { ScrollReveal } from "@/components/scroll-reveal"
import { renderMdxToHtml, readLocalizedMdx } from "@/lib/mdx"
import type { Locale } from "@/lib/site-content"

import BanffLight from "../BanffClaro.jpeg"
import BanffDark from "../BanffOscuro.jpeg"

const aboutCopy = {
  en: {
    title: "About Us",
    description:
      "Banff Studio follows the same logic you see in our portfolio: real product design, clear interfaces, and delivery that can work across Mexico and Canada.",
  },
  fr: {
    title: "À propos de nous",
    description:
      "Banff Studio suit la même logique que celle que vous voyez dans notre portfolio: vrai design produit, interfaces claires et une livraison capable de fonctionner entre le Mexique et le Canada.",
  },
  es: {
    title: "Sobre nosotros",
    description:
      "Banff Studio sigue la misma lógica que ves en nuestro portafolio: diseño de producto real, interfaces claras y una entrega que pueda funcionar entre Canadá y México.",
  },
} as const

type AboutPageContentProps = {
  locale: Locale
}

export function AboutPageContent({ locale }: AboutPageContentProps) {
  const copy = aboutCopy[locale]
  const doc = readLocalizedMdx("about", locale) ?? readLocalizedMdx("about", "en")

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-12 pt-28 sm:px-6 lg:pt-32">
      <ScrollReveal direction="up" once>
<<<<<<< HEAD
        <section className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.45em] text-[color:var(--accent)]">{copy.title}</p>
          <p className="mt-5 text-lg leading-8 text-muted-foreground sm:text-xl">{copy.description}</p>
        </section>
      </ScrollReveal>

      <ScrollReveal direction="up" once className="mt-8">
        <section className="relative flex items-center justify-center">
          <Image src={BanffLight} alt="Banff Studio logo" priority className="block h-auto w-full dark:hidden" />
          <Image src={BanffDark} alt="Banff Studio logo" priority className="hidden h-auto w-full dark:block" />
=======
        <section className="grid gap-8 rounded-[2rem] border border-border/60 bg-card/80 p-5 text-card-foreground shadow-[0_18px_55px_-28px_rgba(2,6,23,0.45)] dark:bg-card/70 lg:grid-cols-[1.1fr_minmax(280px,0.9fr)] lg:p-8">
          <ScrollReveal direction="up" once className="flex flex-col justify-center text-left">
            <div className="mx-auto max-w-3xl text-center lg:text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.45em] text-[color:var(--accent)]">
                {copy.title}
              </p>
              <p className="mt-5 text-lg leading-8 text-muted-foreground sm:text-xl">
                {copy.description}
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="down" once className="relative flex items-center justify-center">
            <div className="absolute inset-0 rounded-[2rem] bg-white/10 blur-3xl dark:bg-black/25" />
            <div className="relative w-full overflow-hidden rounded-[2rem] border border-white/15 bg-white/70 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.20)] backdrop-blur-xl dark:border-white/10 dark:bg-black/40 sm:p-8">
              <Image src={BanffLight} alt="Banff Studio logo" priority className="block h-auto w-full dark:hidden" />
              <Image src={BanffDark} alt="Banff Studio logo" priority className="hidden h-auto w-full dark:block" />
            </div>
          </ScrollReveal>
>>>>>>> parent of e92907a (changes on packages 13)
        </section>
      </ScrollReveal>

      {doc ? (
        <ScrollReveal direction="up" once className="mt-8">
          <MdxArticle title={doc.title} excerpt={doc.excerpt} html={renderMdxToHtml(doc.content)} />
        </ScrollReveal>
      ) : null}
    </main>
  )
}
