const Html = {
	search: (root, selector) => {
		let elements = Array.from(root.querySelectorAll(selector));
		const shadowRoots = root.querySelectorAll("*").filter((el) => el.shadowRoot);
		shadowRoots.forEach((shadowRoot) => {
			const shadowElements = Html.search(shadowRoot, selector);
			elements = [...elements, shadowElements];
		});
		return elements;
	},
	render: (root, html) => {
		root.innerHTML = html;
	}
};
export default Html;
