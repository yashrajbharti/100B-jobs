export class UserProfile extends HTMLElement {
  static get observedAttributes() {
    return ["name", "location", "mail", "tel"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const name = this.getAttribute("name") || "";
    const location = this.getAttribute("location") || "";
    const mail = this.getAttribute("mail") || "";
    const tel = this.getAttribute("tel") || "";

    this.shadowRoot.innerHTML = `
            <style>
                article {
                    display: flex;
                    align-items: center;
                    justify-content: space-around;
                    max-inline-size: 900px;
                    inline-size: 90%;
                    margin-inline: auto;
                }

                a {
                    color: var(--md-sys-color-primary, blue);
                    text-underline-offset: 3px;
                    display: block;
                }

                .info {
                    display: flex;
                    flex-direction: column;
                }
            </style>
            <article>
                <random-color-svg width="92px" height="92px" username="${name}"></random-color-svg>
                <div class="info">
                    <h1>${name}</h1>
                    <p>${location}</p>
                    <a href="mailto:${mail}">${mail}</a>
                    <a href="tel:${tel}">${tel}</a>
                </div>
            </article>
        `;
  }
}
