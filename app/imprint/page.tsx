import Nav from "../components/Nav";
import Footer from "../components/Footer";

export default function ImprintPage() {
  return (
    <div className="overflow-x-hidden">
      <Nav />
      <main className="px-6 pt-32 pb-24">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-12">Imprint</h1>

          <div className="space-y-6 text-charcoal/80">
            <h2 className="headline-label">Information according to § 5 TMG</h2>
            <p>
              Krekeny GmbH
              <br />
              Karlstr. 54
              <br />
              63065 Offenbach am Main
              <br />
              Germany
            </p>

            <h2 className="headline-label mt-10">Represented by</h2>
            <p>Sam Sauer &amp; Michael Ehrich</p>

            <h2 className="headline-label mt-10">Contact</h2>
            <p>
              Phone: +49 (0) 69 710 402 30
              <br />
              Fax: +49 (0) 69 407 667 81
              <br />
              Email:{" "}
              <a
                href="mailto:hello+eny@krekeny.com"
                className="text-pacific underline"
              >
                hello+eny@krekeny.com
              </a>
            </p>

            <h2 className="headline-label mt-10">Commercial register</h2>
            <p>
              Registered at Amtsgericht Offenbach am Main
              <br />
              Registration number: HRB 53756
            </p>

            <h2 className="headline-label mt-10">VAT ID</h2>
            <p>DE 3436 4277 9</p>

            <h2 className="headline-label mt-10">
              Responsible for content according to § 55 Abs. 2 RStV
            </h2>
            <p>
              Michael Ehrich
              <br />
              Karlstr. 54
              <br />
              63065 Offenbach am Main
            </p>

            <h2 className="headline-label mt-10">Dispute resolution</h2>
            <p>
              The European Commission provides a platform for online dispute
              resolution (OS):{" "}
              <a
                href="https://ec.europa.eu/consumers/odr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pacific underline"
              >
                https://ec.europa.eu/consumers/odr
              </a>
              .
              <br />
              We are not willing or obliged to participate in dispute resolution
              proceedings before a consumer arbitration board.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
