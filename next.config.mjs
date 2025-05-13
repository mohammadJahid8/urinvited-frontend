/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    console.log(process.env.NODE_ENV);
    if (process.env.NODE_ENV !== "production") {
      return [];
    }

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
