export class AdvancedTimeline extends HTMLElement {
  static get observedAttributes() {
    return ["timeline", "title"];
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
    const experiences = JSON.parse(this.getAttribute("timeline") || "{}");
    const { degrees } = experiences;
    const title = this.getAttribute("title") || [];

    this.shadowRoot.innerHTML = `
          <style>
            article {
              max-inline-size: max-content;
              inline-size: 90%;
              margin-inline: auto;
              margin-block-start: 100px;
              display: flex;
              flex-wrap: wrap;
              justify-content: center;
              align-items: start;
              gap: 0 25px;
            }
    
            .timeline {
              padding-inline: 40px;
              line-height: 5;
              border-inline-start: 2px solid var(--md-sys-color-primary-container);
    
              & > .info {
                list-style: none;
                position: relative;
              }
    
              & > .info::after {
                position: absolute;
                content: "";
                block-size: 10px;
                inline-size: 10px;
                border-radius: 50%;
                background-color: var(--md-sys-color-primary);
                inset-inline-start: -46px;
                inset-block-start: 50%;
                translate: 0 -50%;
              }
            }
          </style>
          <article>
            <h2>${title} - ${experiences.highest_level}</h2>
            <ul class="timeline">
              ${
                degrees
                  ? degrees
                      .map(
                        (degree) => `
                <li class="info">
                ${degree}
                </li>
              `
                      )
                      .join("")
                  : "No Education History"
              }
            </ul>
          </article>
        `;
  }
}
