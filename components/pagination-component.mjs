export class PaginationComponent extends HTMLElement {
  static get observedAttributes() {
    return ["current", "per-page", "total"];
  }
  // Inspired from the npm package @fouita/pagination
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
      <style>
        div {
          text-align: center;
          margin-block-start: 40px;
          margin-block-end: 50px;
        & > button {
              padding: 10px 15px;
              margin: 5px 5px;
              border: none;
              background: var(--md-sys-color-background);
              color: var(--md-sys-color-on-surface);
              cursor: pointer;
              border: 2px solid var(--md-sys-color-outline);
              border-radius: 12px;
              font-size: 14px;
           
              &:hover:not(:disabled) {
                background: var(--md-sys-color-inverse-primary);
              }
              &:disabled {
                cursor: default;
                opacity: 0.3;
              }

              &.active {
                background: var(--md-sys-color-inverse-primary);
                border-color: var(--md-sys-color-primary);
                font-weight: bold;
              }
       }
      </style>
      <div id="pagination"></div>
    `;
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

    const container = this.shadowRoot.querySelector("#pagination");
    container.innerHTML = "";

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
        btn.addEventListener("click", (e) => {
          callback();
          this.dispatchEvent(
            new CustomEvent("page-change", {
              detail: {
                offset: this.current,
                limit: this.perPage,
                total: this.total,
                totalPages: this.totalPages,
              },
              bubbles: true,
              composed: true,
            })
          );
        });
      }
      buttons.push(btn);
      return btn;
    };

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
        const btn = createButton(
          i.toString(),
          () => (this.current = (i - 1) * this.perPage),
          false
        );
        if (i === currentPage) btn.classList.add("active");
      }
    }

    if (currentPage < totalPages - 2) {
      if (currentPage < totalPages - 3) createButton("...", null, true);
      createButton(
        (totalPages - 1).toString(),
        () => (this.current = (totalPages - 2) * this.perPage)
      );
      createButton(
        totalPages.toString(),
        () => (this.current = (totalPages - 1) * this.perPage)
      );
    }

    createButton(
      "›",
      () => {
        const next = this.current + this.perPage;
        this.current = next >= this.total ? this.current : next;
      },
      currentPage === totalPages,
      "next"
    );

    buttons.forEach((btn) => container.appendChild(btn));
  }
}
