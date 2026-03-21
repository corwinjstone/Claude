const BASE = "https://images.contentstack.io/v3/assets/blt1788ad84f88b68a8";

const APP_STORE_IMG = `${BASE}/blteba799f14d6636f3/699cbb0ae8917700087c2c77/AppleAppStore_AppButton.webp`;
const GOOGLE_PLAY_IMG = `${BASE}/blt0c285a4db2ce250c/699cbb08e7abe60008a215ff/GooglePlay_AppButton.webp`;
const APP_LINK = "https://capitalonetravel.smart.link/2p1nsk5ck";

const footerLinks = [
  { title: "Privacy", href: "https://www.capitalone.com/privacy" },
  { title: "Security", href: "https://www.capitalone.com/digital/identity-protection/" },
  { title: "Site Terms of Use", href: "https://travel.capitalone.com/site-terms-of-use/" },
  {
    title: "Capital One Travel Terms & Conditions",
    href: "https://travel.capitalone.com/terms-of-service/",
  },
];

export default function Footer() {
  return (
    <footer className="bg-white">
      {/* Main footer */}
      <div className="mx-auto px-6 md:px-12" style={{ maxWidth: "1280px" }}>
        <div className="py-6">
          {/* Mobile links */}
          <div className="mb-10 md:mb-6 flex lg:hidden">
            <ul className="space-y-2 md:flex md:items-center md:space-x-2 md:space-y-0 md:divide-x md:divide-[#e9e9e9]">
              {footerLinks.map((link) => (
                <li key={link.title} className="md:pl-2 first:pl-0">
                  <a
                    href={link.href}
                    target="_blank"
                    rel="nofollow noreferrer"
                    className="text-xs text-[#525252] transition hover:text-[#16597a]"
                  >
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex lg:items-center justify-between flex-col lg:flex-row">
            <div className="lg:flex lg:items-center">
              <div className="mb-10 md:mb-6 lg:mb-0">
                <p className="text-xs text-[#525252]">© 2026 Capital One</p>
              </div>
              {/* Desktop links */}
              <div className="hidden lg:block lg:ml-32">
                <ul className="flex items-center space-x-2 divide-x divide-[#e9e9e9]">
                  {footerLinks.map((link) => (
                    <li key={link.title} className="pl-2 first:pl-0">
                      <a
                        href={link.href}
                        target="_blank"
                        rel="nofollow noreferrer"
                        className="text-xs text-[#525252] transition hover:text-[#16597a]"
                      >
                        {link.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* FDIC + Equal Housing */}
            <div className="flex items-end gap-4 mt-6 lg:mt-0">
              <a
                href="https://www.fdic.gov/"
                target="_blank"
                rel="nofollow noreferrer"
                aria-label="FDIC Member"
                className="opacity-60 hover:opacity-80 transition text-[#00132b]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="53" height="32" fill="currentColor" viewBox="0 0 43 26">
                  <path fillRule="evenodd" d="M.021 3.57l.022 3.558.759.024.759.023.007-2.944c.007-2.76.015-2.916.13-2.492.125.466 1.027 3.545 1.392 4.754l.206.682.79-.024.789-.023.787-2.674c.434-1.47.824-2.799.867-2.952.054-.19.079.652.079 2.674v2.952l.84.023.842.024V.01H5.589l-.163.555c-.7 2.384-1.145 3.992-1.2 4.34l-.067.412-.063-.411c-.036-.227-.35-1.42-.7-2.654L2.759.011H0l.021 3.558zm9.52 0l.02 3.558 2.36.022 2.36.022V5.77h-2.955V4.124h2.708V2.808h-2.708v-1.48h2.872V.01H9.52l.021 3.558zm5.908 0l.021 3.558.76.024.758.023.005-2.944.005-2.945.278.988c.152.543.534 1.857.847 2.92l.57 1.934H20.297l.794-2.715c.437-1.494.828-2.84.87-2.993.05-.183.075.748.075 2.715v2.993h1.641l.022-3.559.021-3.558h-2.697l-.086.267c-.295.92-1.239 4.316-1.29 4.644l-.064.396-.061-.411c-.034-.227-.348-1.42-.698-2.654L18.187.011h-2.76l.022 3.558zm9.519 0l.021 3.558 1.724-.005c1.857-.006 2.349-.084 2.917-.468 1.045-.707.903-2.539-.236-3.044l-.374-.166.293-.15c.66-.34.969-1.081.794-1.906-.07-.328-.173-.513-.431-.772-.528-.532-.894-.606-2.98-.606h-1.75l.022 3.558zm6.4 0l.022 3.558 2.36.022 2.359.022V5.77h-2.955V4.124h2.708V2.808h-2.708v-1.48h2.872V.01h-4.679l.022 3.558zm5.91-.006l.02 3.564h1.724l.022-1.378.023-1.378h.33c.58 0 .907.284 1.087.946.025.09.16.544.3 1.008l.255.843h.9c.693 0 .899-.025.899-.11 0-.13-.852-2.6-.99-2.869a2.26 2.26 0 00-.297-.403l-.199-.215.25-.103c.813-.338 1.213-1.612.777-2.48-.155-.307-.636-.706-.996-.824-.196-.064-1.012-.113-2.219-.133L37.256 0l.021 3.564zm-9.602-2.266c.406.067.719.384.719.729 0 .535-.49.862-1.293.863h-.348V1.246l.307.001c.17 0 .446.024.615.052zm12.569.062c.359.15.541.424.541.814 0 .633-.334.881-1.186.881h-.537v-1.81h.454c.25 0 .577.052.728.115zm-12.14 2.892c.41.195.556.627.36 1.06-.148.326-.426.456-1.094.513l-.617.052V4.125h.541c.319 0 .652.052.81.127zm9.235 4.394c-3.11.662-5.617 2.855-6.586 5.764-.37 1.109-.43 1.531-.42 2.92.008 1.139.038 1.428.224 2.134.544 2.07 1.799 3.766 3.699 4.998 1.322.858 2.863 1.349 4.519 1.44.945.053 1.73-.062 3.188-.467l.956-.266v-5.082l-.513.421c-1.998 1.637-4.708 1.607-6.374-.07-.874-.88-1.237-1.826-1.237-3.216 0-2.09 1.08-3.716 2.895-4.356.694-.245 1.853-.295 2.603-.112.727.178 1.562.62 2.114 1.122l.514.467-.022-2.537-.021-2.537-.78-.265c-1.55-.526-3.339-.66-4.76-.358zM.002 17.209v8.311l2.154-.022 2.154-.022.021-3.27.022-3.271H9.028v-3.62H4.351v-2.798h5.17v-3.62H0v8.312zm10.34-.002v8.31l2.974-.002c1.636-.002 3.344-.037 3.795-.08 3.56-.328 6.364-2.62 7.398-6.047.207-.686.224-.848.223-2.18 0-1.21-.029-1.541-.174-2.07-.92-3.347-3.563-5.658-7.036-6.155-.316-.046-2.061-.083-3.878-.084l-3.303-.002v8.31zm15.099 0v8.31H29.708V8.897H25.44v8.31zm-8.337-4.485c1.567.418 2.708 1.587 3.094 3.169.063.257.107.86.103 1.398-.005.8-.04 1.049-.228 1.605-.65 1.929-2.242 2.908-4.746 2.918l-.718.003v-9.322l1.005.05c.553.027 1.223.108 1.49.179z" clipRule="evenodd" />
                </svg>
              </a>
              <img
                src="/icons/equal_housing_opportunity.svg"
                alt="Equal Housing Opportunity Logo"
                width={128}
                height={32}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>

      {/* App download bar */}
      <div className="bg-[#f2f2f2] py-5">
        <div
          className="flex lg:items-center px-6 md:px-12 mx-auto flex-col-reverse lg:flex-row"
          style={{ maxWidth: "1280px" }}
        >
          <div className="flex gap-3">
            <a
              href={APP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download on the Apple App Store"
            >
              <img
                src={APP_STORE_IMG}
                alt="Download on the Apple App Store"
                width={128}
                height={48}
                className="h-8 w-auto"
                loading="lazy"
              />
            </a>
            <a
              href={APP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Get it on Google Play"
            >
              <img
                src={GOOGLE_PLAY_IMG}
                alt="Get it on Google Play"
                width={128}
                height={48}
                className="h-8 w-auto"
                loading="lazy"
              />
            </a>
          </div>
          <p className="text-xs text-[#525252] pb-5 lg:pl-7 lg:pb-0">
            Download the Capital One Travel app
          </p>
        </div>
      </div>
    </footer>
  );
}
