import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["taswera.evyx.lol","127.0.0.1"],
  },
  output: "standalone",
};

export default withNextIntl(nextConfig);
