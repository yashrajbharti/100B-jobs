export class PaginationComponent extends HTMLElement {
  static get observedAttributes() {
    return ["current", "per-page", "total"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.render();
  }

  get current() {
    return parseInt(this.getAttribute("current")) || 0;
  }

  set current(val) {
    this.setAttribute("current", val);
  }

  get perPage() {
    return parseInt(this.getAttribute("per-page")) || 10;
  }

  get total() {
    return parseInt(this.getAttribute("total")) || 0;
  }

  get totalPages() {
    return Math.ceil(this.total / this.perPage);
  }

  render() {
    const currentPage = Math.floor(this.current / this.perPage) + 1;
    const totalPages = this.totalPages;
    const buttons = [];

    const createButton = (
      label,
      callback = null,
      disabled = false,
      title = label
    ) => {
      const btn = document.createElement("button");
      btn.textContent = label;
      if (title) btn.title = `Navigate to ${title} page`;
      if (disabled) {
        btn.disabled = true;
      } else if (callback) {
        btn.addEventListener("click", callback);
      }
      buttons.push(btn);
    };

    this.shadowRoot.innerHTML = "";

    createButton(
      "‹",
      () => {
        this.current = Math.max(this.current - this.perPage, 0);
      },
      currentPage === 1,
      "previous"
    );

    if (currentPage > 2) {
      createButton("1", () => (this.current = 0));
      if (currentPage > 3) createButton("...", null, true);
    }

    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
      if (i >= 1 && i <= totalPages) {
        createButton(
          i.toString(),
          () => (this.current = (i - 1) * this.perPage),
          i === currentPage
        );
      }
    }

    if (currentPage < totalPages - 2) {
      if (currentPage < totalPages - 3) createButton("...", null, true);
      createButton(
        (totalPages - 1).toString(),
        () => (this.current = (totalPages - 2) * this.perPage),
        false
      );
      createButton(
        totalPages.toString(),
        () => (this.current = (totalPages - 1) * this.perPage),
        false
      );
    }

    createButton(
      "›",
      () => {
        const next = this.current + this.perPage;
        this.current = next >= this.total ? this.current : next;
      },
      currentPage === totalPages,
      "Next"
    );

    buttons.forEach((btn) => this.shadowRoot.appendChild(btn));
  }
}
