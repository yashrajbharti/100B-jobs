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
            article.container {
              max-inline-size: max-content;
              inline-size: 90%;
              margin-inline: auto;
              margin-block-start: 100px;
              display: flex;
              flex-wrap: wrap;
              justify-content: center;
              align-items: start;
              gap: 0 25px;

              & md-chip-set{
                margin-block-end: 15px;
              }
            }
    
            .timeline {
              border-inline-start: 2px solid var(--md-sys-color-primary-container);
    
              & > .info {
                list-style: none;
                position: relative;
                & > article {
                position: relative;
                background-color: color-mix(in srgb, var(--md-sys-color-primary-container) 15%, transparent 85%);
                padding: 30px;
                margin-block: 40px;
                border-radius: 24px;
                  & > div {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                  }
                }
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
          <article class="container">
            <h2>${title} - ${experiences.highest_level}</h2>
            <ul class="timeline">
              ${
                degrees
                  ? degrees
                      .map(
                        (education) => `
                <li class="info">
                      <article class="education-card">
                          <h3>${education.degree}</h3>
                          ${
                            education.isTop50 || education.isTop25
                              ? `<md-chip-set>
                              <md-assist-chip label="Top School"></md-assist-chip>
                          </md-chip-set>`
                              : ""
                          }
                          <div class="time">
                              <md-icon-button aria-label="date range">
                                  <md-icon>date_range</md-icon>
                              </md-icon-button>
                              <p>${education.startDate || "N/A"} - ${
                          education.endDate || "N/A"
                        }</p>
                          </div>
                          <div class="grades">
                              <md-icon-button aria-label="Grading">
                                  <md-icon>star</md-icon>
                              </md-icon-button>
                              <p>${education.gpa}</p>
                          </div>
                          <div class="school">
                              <md-icon-button aria-label="School">
                                  <md-icon>school</md-icon>
                              </md-icon-button>
                              <div><p>${education.originalSchool}</p>
                              <p>(${education.school})</p></div>
                          </div>
                          <div class="subject">
                              <md-icon-button aria-label="Subject">
                                  <md-icon>book_2</md-icon>
                              </md-icon-button>
                              <p>${education.subject || "N/A"}</p>
                          </div>  
                          <md-ripple></md-ripple>
                      </article>
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
