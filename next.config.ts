import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['pdf-parse', 'wav', 'openai'],
  experimental: {
    serverActions: {
      // PDF uploads are sent as base64 data URIs via server actions.
      // The default 1MB limit breaks anything above ~750KB, so raise it to
      // comfortably fit the largest allowed upload (10MB -> ~13.3MB base64).
      bodySizeLimit: '25mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
