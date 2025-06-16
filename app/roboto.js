export default function robot() {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: "/api/",
            },
        ],
        sitemap: "https://geoblits.ayush.it.com/sitemap.xml",
    };
}