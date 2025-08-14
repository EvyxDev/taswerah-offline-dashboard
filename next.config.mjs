import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["taswera.evyx.lol"],
  },
  output: "standalone",
};

export default withNextIntl(nextConfig);
