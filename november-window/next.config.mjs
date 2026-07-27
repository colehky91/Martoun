/** @type {import('next').NextConfig} */
const nextConfig = {
  // playbook.html is read from /content at request time — keep it in the bundle
  outputFileTracingIncludes: { "/course/playbook": ["./content/**"] },
  // this app lives in a subdirectory of the repo; don't trace from the outer lockfile
  outputFileTracingRoot: import.meta.dirname,
};
export default nextConfig;
