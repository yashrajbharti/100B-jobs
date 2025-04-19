import { formatDate } from "../utils/dateFormat.mjs";

export class CandidateDetails extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return [
      "submitted_at",
      "work_availability",
      "compensation",
      "score",
      "top",
    ];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this[name] = newValue;
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    if (!this.shadowRoot) return;

    const score = parseFloat(this.score / 10 || "0");
    const scorePercent = Math.round(score * 100);
    const topDisplay = this.top ? `(${this.top})` : "";

    const availability = this.work_availability?.split(",") ?? [];

    this.shadowRoot.innerHTML = `
        <style>
        article {
            text-align: center;
            position: relative;
            display: block;
            box-sizing: border-box;
            margin-inline: auto;
            background-color: color-mix(in srgb, var(--md-sys-color-primary-container) 15%, transparent 85%);
            padding: 40px;
            margin-block: 100px;
            border-radius: 20px;
            inline-size: 90%;
            max-inline-size: 900px;
            padding-block-end: 80px;

            &>.score {
                margin: 20px;
                display: flex;
                flex-direction: column;
                gap: 15px;
                align-items: center;
                &>h2 {
                    font-size: 1.9rem;
                    color: var(--md-sys-color-primary);
                }

                &>md-circular-progress {
                    width: 100px;
                    height: 100px;
                }
            }

            &>.container {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-around;
                align-items: baseline;
                gap: 15px;
                &>div {
                    &>p {
                        color: var(--md-sys-color-on-surface-variant);
                    }

                    &>h3 {
                        font-size: 1.4rem;
                    }
                }
            }
            md-filled-icon-button{
              position: absolute;
              inset-block-end: 0;
              inset-inline-start: 50%;
              translate: -50% 0;
              padding: 5px;
              background-color: var(--md-sys-color-primary);
              border-radius: 24px 24px 0 0;
            }
        }
        </style>
        <article>
            <div class="score">
              <md-circular-progress value="${score}"></md-circular-progress>
              <h2>${scorePercent}% Score ${
      topDisplay ? `(${topDisplay} candidate)` : ""
    }</h2>
            </div>
            <div class="container">
                <div class="compensation">
                <h3> ${this.compensation}</h3>
                  <p>Expected full time pay</p>
                </div>
                <div class="availability">
                  <md-chip-set>
                    ${availability
                      .map(
                        (available_time) =>
                          `<md-assist-chip label="${available_time}"></md-assist-chip>`
                      )
                      .join("")}
                  </md-chip-set>
                  <p>Work Availability</p>
                </div>
                <div>
                  <h3>${formatDate(this.submitted_at)}</h3>
                  <p>Submission Date</p>
                </div>
            </div>
            <md-filled-icon-button>
              <md-icon>check</md-icon>
            </md-filled-icon-button>
            <md-ripple></md-ripple>
        </article>
      `;
  }
}
