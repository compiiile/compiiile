export default {
	title: "Compiiile",
	description:
		"Compiiile is the most convenient way to render a folder containing markdown files. Previewing and searching markdown files has never been that easy (it's really just a command away !)",
	siteUrl: "https://compiiile.me",
	integrations: [
		{
			name: "umami",
			hooks: {
				"astro:config:setup": ({injectScript}) => {
					if(process.env.ANALYTICS_URL && process.env.ANALYTICS_ID){
						injectScript('head-inline', `
							const script = document.createElement("script")
							script.setAttribute("src", "${process.env.ANALYTICS_URL}")
							script.dataset.websiteId = "${process.env.ANALYTICS_ID}"
							script.setAttribute("defer", "")
							document.head.appendChild(script)
						`);
					}
				}
			}
		}
	]
}
