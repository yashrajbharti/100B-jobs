export class CandidateCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const name = this.getAttribute("name") || "";
    const email = this.getAttribute("email") || "";
    const link = this.getAttribute("link") || "#";
    const skills = (this.getAttribute("skills") || "")
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    const template = document.createElement("template");
    template.innerHTML = `
      <style>
        article {
          position: relative;
          inline-size: 90%;
          max-inline-size: 900px;
          margin-inline: auto;
          block-size: max-content;
          background-color: var(--md-sys-color-on-background);
          padding: 20px;
          margin-block: 20px;
          box-sizing: border-box;
          border-radius: 20px;
        & > h2 {
          margin-block-start: 0;
        }

        & > a {
          color: var(--md-sys-color-primary);
          text-underline-offset: 3px;
          display: inline-block;
        }

        & > a::after {
          // position: absolute;
          // display: block;
          // content: "";
          // inset-inline-start: 0;
          // inset-block-start: 0;
          // inline-size: 100%;
          // block-size: 100%;
        }

        & > md-chip-set {
          padding-block-start: 10px;
          padding-block-end: 20px;
        }
      }
      </style>
      <article>
        <h2>${name}</h2>
        <p>${email}</p>
        <md-chip-set class="skill">
          ${skills
            .map(
              (skill) => `<md-assist-chip label="${skill}"></md-assist-chip>`
            )
            .join("")}
        </md-chip-set>
        <a href="${link}">Visit ${name}'s profile</a>
        <md-ripple></md-ripple>
      </article>
    `;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}
