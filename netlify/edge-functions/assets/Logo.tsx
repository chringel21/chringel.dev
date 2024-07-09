import React from "https://esm.sh/react@18.2.0";

interface Props {
  logo: string;
}

const LOGOS = [
  "11ty",
  "hugo",
  "indieweb",
  "javascript",
  "node.js",
  "uberspace",
];

function getImageUrl(imagePath: string) {
  const BASE_URL = Netlify.env.get("BASE_URL");
  return `url(${BASE_URL}${imagePath})`;
}

export const Logo: React.FC<{ logo: string }> = ({ logo }) => {
  if (!logo || !LOGOS.includes(logo)) return <></>;
  return (
    <div
      style={{
        width: "50px",
        height: "50px",
        margin: "5px",
        backgroundSize: "100% 100%",
        backgroundImage: getImageUrl(`/img/logos/${logo}.svg`),
      }}
    ></div>
  );
};
