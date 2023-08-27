const template = document.createElement('template')
template.innerHTML = /* html */ `
  <style>
.bt {
  background-color: #134f55;
  border: 1px solid #014a50;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  width: 140px;
  height: 30px;
  color: #DDD;
  margin: 5px;
  margin-top: 10px;
}

.bt:hover {
  background-color: #014a50;
  color: #FFF;
  cursor: pointer;
}
  </style>
  <button class="bt">
    <slot></slot>
  </button>
`

export class BaseButton extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' })
    const clonedTemplate = template.content.cloneNode(true)
    this.shadowRoot?.appendChild(clonedTemplate)
  }
}

customElements.define('base-button', BaseButton)
