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

    const score = parseFloat(this.score || "0");
    const scorePercent = Math.round(score * 100);
    const topDisplay = this.top ? `(${this.top})` : "";

    this.shadowRoot.innerHTML = `
        <div class="score">
          <md-circular-progress value="${score}"></md-circular-progress>
          ${scorePercent}% Score ${topDisplay}
        </div>
        <div class="compensation">
          Expected compensation: ${this.compensation}
        </div>
        <div class="availability">
          Available for: ${this.work_availability} 
        </div>
        <div>
          Submitted on: ${new Date(this.submitted_at).toDateString()}
        </div>
      `;
  }
}
