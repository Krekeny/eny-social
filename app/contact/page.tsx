import Nav from "../components/Nav";
import Footer from "../components/Footer";

export default function ContactPage() {
  return (
    <div className="overflow-x-hidden">
      <Nav />
      <main className="px-6 pt-32 pb-24">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-12">Contact</h1>

          <div className="prose space-y-6 text-charcoal/80">
            <p>
              Have a question, idea, or just want to say hello? We&apos;d love
              to hear from you.
            </p>

            <h2 className="headline-label mt-10">Email</h2>
            <p>
              <a
                href="mailto:hello+eny@krekeny.com"
                className="text-pacific underline"
              >
                hello+eny@krekeny.com
              </a>
            </p>

            <h2 className="headline-label mt-10">Phone</h2>
            <p>+49 (0) 69 710 402 30</p>

            <h2 className="headline-label mt-10">Social</h2>
            <p>
              <a
                href="https://bsky.app/profile/eny.social"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pacific underline"
              >
                Bluesky
              </a>
              {" · "}
              <a
                href="https://www.linkedin.com/company/krekeny/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pacific underline"
              >
                LinkedIn
              </a>
              {" · "}
              <a
                href="https://instagram.com/krekeny"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pacific underline"
              >
                Instagram
              </a>
            </p>

            <h2 className="headline-label mt-10">Address</h2>
            <p>
              Krekeny GmbH
              <br />
              Karlstr. 54
              <br />
              63065 Offenbach am Main
              <br />
              Germany
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
