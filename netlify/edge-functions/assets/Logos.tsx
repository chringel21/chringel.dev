import React from "https://esm.sh/react@18.2.0";
import { Logo } from "./Logo.tsx";

function findOne(haystack: string[], array: string[] | undefined) {
  if (!array) return false;
  return array.some((v) => haystack.includes(v.toLocaleLowerCase()));
}

export const Logos: React.FC<{
  tags: string[] | undefined;
  availableLogos: string[];
}> = ({ tags, availableLogos }) => {
  if (!tags || !findOne(availableLogos, tags)) return <></>;
  return (
    <>
      <div
        style={{
          fontSize: "30px",
          fontWeight: 700,
          alignSelf: "center",
        }}
      >
        feat.
      </div>
      {tags.map((tag: string) => (
        <Logo logo={tag.toLowerCase()} availableLogos={availableLogos}></Logo>
      ))}
    </>
  );
};
