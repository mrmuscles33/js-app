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
};
export default Html;
