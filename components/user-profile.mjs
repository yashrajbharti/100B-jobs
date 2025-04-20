export class UserProfile extends HTMLElement {
  static get observedAttributes() {
    return ["name", "location", "email", "phone"];
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
    const email = this.getAttribute("email") || "";
    const phone = this.getAttribute("phone") || "";

    this.shadowRoot.innerHTML = `
            <style>
                article {
                    display: flex;
                    align-items: center;
                    justify-content: space-around;
                    max-inline-size: 900px;
                    inline-size: 90%;
                    margin-inline: auto;
                    gap: 20px;
                    & h1{
                      font-size: clamp(2rem, 1.175rem + 2vw, 2.2rem);
                    }
                    &> random-color-svg{
                      min-inline-size: 52px;
                    }
                }

                a {
                    color: var(--md-sys-color-primary, blue);
                    text-underline-offset: 3px;
                    display: block;
                    padding-block: 10px;
                }
                md-chip-set{
                    margin-block-end: 15px;
                }
                .info {
                    display: flex;
                    flex-direction: column;
                   
                    &> div{ 
                      display: flex;
                      align-items: center;
                      inline-size: max-content;
                    }
                }
            </style>
            <article>
                <random-color-svg width="100%" height="100%" username="${name}"></random-color-svg>
                <div class="info">
                    <h1>${name || "Untitled Candidate"}</h1>
                    <md-chip-set>
                      <md-assist-chip label="${
                        location || "N/A"
                      }"></md-assist-chip>
                    </md-chip-set>
                    <div>
                      <md-icon-button aria-label="mail">
                        <md-icon>mail</md-icon>
                      </md-icon-button>
                      <a href="mailto:${email}">${email || "N/A"}</a>
                    </div>
                    <div>
                      <md-icon-button aria-label="phone">
                        <md-icon>phone</md-icon>
                      </md-icon-button>
                      <a href="tel:${phone}">${phone || "N/A"}</a>
                    </div>
                </div>
            </article>
        `;
  }
}
