export class SkillsComponent extends HTMLElement {
  static get observedAttributes() {
    return ["skills"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.render();
  }
  render() {
    const skills = this.getAttribute("skills");
    const skillArray = skills ? skills.split(",") : [];

    this.shadowRoot.innerHTML = `
        <style>
          md-chip-set {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            margin-block-end: 50px;
          }
          h2 {
            text-align: center;
          }
        </style>
        <h2>${skillArray.length ? "Skills" : ""}</h2>
        <md-chip-set>
          ${skillArray
            .map(
              (skill) => `<md-assist-chip label="${skill}"></md-assist-chip>`
            )
            .join("")}
        </md-chip-set>
      `;
  }
}
