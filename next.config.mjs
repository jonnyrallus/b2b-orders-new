import path from 'path';
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  webpack(config) {
    config.resolve.alias['@'] = path.resolve(process.cwd()); // κάνει το "@" να δείχνει στη ρίζα
    return config;
  },
};
export default nextConfig;
