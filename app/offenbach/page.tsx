"use client";

import Nav from "../components/Nav";
import Footer from "../components/Footer";
import FadeIn from "../components/ui/FadeIn";
import SectionIntroLabel from "../components/ui/SectionIntroLabel";
import ButtonCta from "../components/ui/ButtonCta";

export default function OffenbachPage() {
  const features = [
    {
      title: "Find your neighbors",
      description:
        "Connect with people in your neighborhood. Share recommendations, organize meetups, or just say hello.",
      color: "var(--tangerine-dream)",
    },
    {
      title: "Local events",
      description:
        "Discover what's happening around you from street festivals to gallery openings to community cleanups.",
      color: "var(--cotton-candy)",
    },
    {
      title: "City services",
      description:
        "Trash collection schedules, public transport updates, official announcements: all in one feed.",
      color: "var(--monte-carlo)",
    },
    {
      title: "Find an apartment",
      description:
        "No more scrolling through five different platforms. Local housing listings from real people.",
      color: "var(--apricot-dream)",
    },
  ];

  return (
    <div className="overflow-x-hidden">
      <Nav />
      <main>
        {/* Hero */}
        <section className="relative px-6 pt-32 pb-24">
          <div className="relative mx-auto max-w-4xl text-center">
            <FadeIn>
              <SectionIntroLabel>offenbach.social</SectionIntroLabel>
            </FadeIn>

            <FadeIn delay={100}>
              <h2 className="mt-6">
                Your city. Your community.{" "}
                <span className="italic text-tangerine">One app.</span>
              </h2>
            </FadeIn>

            <FadeIn delay={200}>
              <p className="section-copy mx-auto mt-8 max-w-2xl">
                Offenbach is where eny.social begins. A hyper-local social
                network for the people who live here. Connecting neighbors,
                surfacing local events, and making city life easier.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Features */}
        <section className="px-6 py-24">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-8 md:grid-cols-2">
              {features.map((feature, i) => (
                <FadeIn key={feature.title} delay={i * 100}>
                  <div
                    className="rounded-3xl p-8"
                    style={{ backgroundColor: feature.color }}
                  >
                    <h3 className="headline-label mb-4">{feature.title}</h3>
                    <p className="section-copy">{feature.description}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-24">
          <div className="mx-auto max-w-2xl text-center">
            <FadeIn>
              <h2>
                Be part of the{" "}
                <span className="italic text-tangerine">first wave</span>
              </h2>
            </FadeIn>
            <FadeIn delay={100}>
              <p className="section-copy mx-auto mt-6 max-w-lg">
                We&apos;re launching in Offenbach first. Join the waitlist and
                help shape what a local social network can be.
              </p>
            </FadeIn>
            <FadeIn delay={200}>
              <ButtonCta href="/#waitlist" variant="ghost" className="mt-10">
                join the waitlist
              </ButtonCta>
            </FadeIn>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
