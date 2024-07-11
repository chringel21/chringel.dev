import React from "https://esm.sh/react@18.2.0";

function getImageUrl(imagePath: string) {
  const BASE_URL = Netlify.env.get("BASE_URL");
  return `url(${BASE_URL}${imagePath})`;
}

export const Logo: React.FC<{ logo: string; availableLogos: string[] }> = ({
  logo,
  availableLogos,
}) => {
  if (!logo || !availableLogos.includes(logo)) return <></>;

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
