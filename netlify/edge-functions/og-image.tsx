import type { Config, Context } from "@netlify/edge-functions";
import { ImageResponse } from "https://deno.land/x/og_edge@0.0.6/mod.ts";
import React from "https://esm.sh/react@18.2.0";
import { Logos } from "./assets/Logos.tsx";

const LOGOS = [
  "11ty",
  "hugo",
  "indieweb",
  "javascript",
  "node.js",
  "uberspace",
];

const FONTS = [
  {
    name: "Space Grotesk",
    weight: 700,
    style: "normal",
    filePath: "space-grotesk-v13-latin-700.woff",
  },
  {
    name: "Space Grotesk",
    weight: 300,
    style: "normal",
    filePath: "space-grotesk-v13-latin-regular.woff",
  },
];

const STYLES = {
  wrapper: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    fontFamily: "Space Grotesk",
    backgroundImage:
      "linear-gradient(to bottom left, rgba(138, 230, 251, 1), rgba(255, 222, 105, 1))",
  },
  bg: {
    backgroundImage: getImageUrl("/img/background.svg"),
    backgroundSize: "20% 20%",
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
  },
  h1: {
    fontSize: "64px",
    color: "transparent",
    fontWeight: 700,
    textAlign: "center",
    backgroundImage:
      "linear-gradient(90deg, rgb(0, 124, 240), rgb(0, 223, 216), rgb(121, 40, 202), rgb(255, 0, 128), rgb(255, 77, 77), rgb(249, 203, 40))",
    backgroundClip: "text",
    "-webkit-background-clip": "text",
  },
  logos: {
    display: "flex",
    justifyContent: "center",
  },
  emoji: {
    fontSize: "200px",
    color: "transparent",
    position: "absolute",
    bottom: 0,
    left: "100px",
    transform: "rotate(-30deg)",
  },
  link: {
    fontSize: "36px",
    color: "#cbd5e1",
    fontWeight: 300,
    position: "absolute",
    bottom: 0,
    right: 0,
    padding: "20px",
    margin: "20px",
    backgroundImage: "linear-gradient(to left, #1476ff, #00abda)",
    borderRadius: "10px",
    boxShadow: "0 10px #005b96",
  },
  span: {
    fontSize: "70px",
    position: "absolute",
    top: "-40px",
    left: "-30px",
    transform: "rotate(-50deg)",
  },
};

function getImageUrl(imagePath: string) {
  const BASE_URL = Netlify.env.get("BASE_URL");
  return `url(${BASE_URL}${imagePath})`;
}

async function loadFonts(origin: string) {
  return await Promise.all(
    FONTS.map(async (font) => {
      const { name, weight, style, filePath } = font;
      const url = [origin, "fonts", filePath].join("/");
      const fontFileResponse = await fetch(url);
      const data = await fontFileResponse.arrayBuffer();
      return { name, weight, style, data };
    })
  );
}

async function getPageFromSitemap(slug: string, origin: string) {
  console.log(origin);
  const target = new URL("/sitemap.json", origin);
  console.log(target);
  const siteMapDataResponse = await fetch(target);
  const siteMapData = await siteMapDataResponse.json();
  return siteMapData.find((entry: any) => entry.slug === slug);
}

export default async (request: Request, context: Context) => {
  const { origin } = new URL(request.url);
  const { slug } = context.params;
  const page = await getPageFromSitemap(slug, origin);
  if (!page) return new Response("Not found", { status: 404 });
  const fonts = await loadFonts(origin);

  return new ImageResponse(
    (
      <div style={STYLES.wrapper}>
        <div style={STYLES.bg}></div>
        <h1 style={STYLES.h1}>{page.title}</h1>
        <div style={STYLES.logos}>
          {page.tags && <Logos tags={page.tags} availableLogos={LOGOS}></Logos>}
        </div>
        <span style={STYLES.emoji}>🤔</span>
        <a style={STYLES.link}>
          <span style={STYLES.span}>👇</span>chringel.dev
        </a>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts,
      emoji: "fluent",
    }
  );
};

export const config: Config = { path: "/og-image/:slug" };
