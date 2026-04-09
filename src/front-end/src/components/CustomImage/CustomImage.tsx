"use client";

import { Box, Link } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link as RouterLink } from "react-router-dom";

interface CustomImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  rounded?: boolean;
  href?: string;
}

const ImageWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== "rounded",
})<{ rounded?: boolean }>(({ rounded }) => ({
  display: "inline-block",
  overflow: "hidden",
  borderRadius: rounded ? "50%" : "0",
}));

const StyledImage = styled("img")({
  display: "block",
  width: "100%",
  height: "100%",
  objectFit: "cover",
});

function isExternalHref(href: string) {
  return /^(https?:|mailto:|tel:|#)/.test(href);
}

export function CustomImage({
  src,
  alt,
  width,
  height,
  rounded = false,
  href,
}: CustomImageProps) {
  const image = (
    <ImageWrapper rounded={rounded} sx={{ width, height }}>
      <StyledImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
      />
    </ImageWrapper>
  );

  if (href) {
    const isExternal = isExternalHref(href);

    return (
      <Link
        component={isExternal ? "a" : RouterLink}
        href={isExternal ? href : undefined}
        to={isExternal ? undefined : href}
        underline="none"
        sx={{ display: "inline-flex" }}
        rel={isExternal ? "noreferrer" : undefined}
      >
        {image}
      </Link>
    );
  }

  return image;
}
