const Html = {
	search: (selector, root = document.body) => {
		let elements = Array.from(root.querySelectorAll(selector));
		const shadowRoots = Array.from(root.querySelectorAll("*")).filter((el) => el.shadowRoot);
		shadowRoots.forEach((shadowRoot) => {
			const shadowElements = Html.search(selector, shadowRoot);
			if (shadowElements.length > 0) {
				elements = [...elements, shadowElements];
			}
		});
		return elements;
	},
	render: (root, html) => {
		root.innerHTML = html;
	},
	clean:(strings, ...values) => {
		return strings
			.map((str, i) => `${str}${values[i] || ''}`)
			.join('')
			.replace(/\s*\n\s*/g, ' ')
			.trim();
	},
	onThemeChange: (callback) => {
		const observer = new MutationObserver(callback);
		observer.observe(document.body, { attributes: true, attributeFilter: ['data-theme'] });
	},
};
export default Html;
