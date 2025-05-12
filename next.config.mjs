/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "b.urinvited.io",
          },
        ],
        destination: "https://urinvited.io/:path*",
        permanent: true,
      },
    ];
  },
  images: {
    domains: ["wp1.themevibrant.com", "res.cloudinary.com"],
  },
};

export default nextConfig;
