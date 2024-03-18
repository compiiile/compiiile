const robotsTxt = `
User-agent: *
${JSON.parse(process.env.VITE_COMPIIILE_NO_INDEX) ? "Disallow: /" : "Allow: /"}

${import.meta.env.SITE ? `Sitemap: ${new URL("sitemap-index.xml", import.meta.env.SITE).href}` : ""}
`.trim()

export const GET = () => {
	return new Response(robotsTxt, {
		headers: {
			"Content-Type": "text/plain; charset=utf-8"
		}
	})
}
