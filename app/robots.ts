export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/my-trips", "/profile", "/auth/", "/api/", "/sign-in"],
    },
    sitemap: "https://con-soul.in/sitemap.xml",
  };
}