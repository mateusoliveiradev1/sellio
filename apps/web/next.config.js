/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: [
        '@sellio/api',
        '@sellio/db',
        '@sellio/schemas',
        '@sellio/ml-sdk',
    ],
}

export default nextConfig
