/** @type {import('next').NextConfig} */
const nextConfig = {
    
};
rewrites: async () => {
    return [
      {
        source: '/',
        destination: '/index.html',
      },
    ]
}
export default nextConfig;
