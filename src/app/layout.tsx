import type { Metadata } from "next";
import { Geist, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

/**
 * Two families, both Autumn's own: Inter for everything readable, Geist 400
 * for the letterspaced label tier. Inter is loaded variable and carries its
 * optical-size axis, because the display tiers set `font-variation-settings:
 * "opsz" 32`; next/font only honours `axes` when the weight is left variable,
 * so the single weight this design uses — 500 — is applied in CSS on `body`.
 */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
  preload: true,
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Autumn — your marketing results",
  description:
    "The bookings we drove for your inn, what they were worth, and what they cost you next to the commission you would have paid — in numbers you can check against your own book.",
  /* One property's private numbers. Nothing here belongs in a search index. */
  robots: { index: false, follow: false },
};

/* The five ⓘ glyphs are native <details>; this closes an open one on Escape
   (returning focus to its glyph) or on a click anywhere else. */
const INFO_SCRIPT = `
document.addEventListener("keydown",function(e){
  if(e.key!=="Escape")return;
  var d=document.querySelector("details.au-info[open]");
  if(!d)return;
  d.removeAttribute("open");
  var s=d.querySelector("summary");
  if(s)s.focus();
});
document.addEventListener("click",function(e){
  document.querySelectorAll("details.au-info[open]").forEach(function(d){
    if(!d.contains(e.target))d.removeAttribute("open");
  });
});
document.addEventListener("toggle",function(e){
  var d=e.target;
  if(!(d instanceof HTMLDetailsElement)||!d.classList.contains("au-info")||!d.open)return;
  var c=d.querySelector(".au-info-card");
  if(c){
    c.style.marginLeft="0px";
    var r=c.getBoundingClientRect();
    var vw=document.documentElement.clientWidth;
    var shift=0;
    if(r.right>vw-16)shift=vw-16-r.right;
    if(r.left+shift<16)shift=16-r.left;
    if(shift)c.style.marginLeft=shift+"px";
    c.setAttribute("tabindex","-1");c.focus({preventScroll:true});
  }
},true);
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    /* data-scroll-behavior tells Next to suspend smooth scrolling during route
       transitions, so moving between the two screens lands at the top
       instantly instead of animating there. */
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${geist.variable}`}
    >
      <body>
        {children}
        <Script id="au-info" strategy="afterInteractive">
          {INFO_SCRIPT}
        </Script>
      </body>
    </html>
  );
}
