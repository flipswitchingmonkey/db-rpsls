import { resetState } from '../state'

const template = document.createElement('template')
template.innerHTML = /* html */ `
  <base-button id="reset-score">
    Reset Score
  </base-button>
`

export class ResetStateButton extends HTMLElement {
  constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })
    shadowRoot.appendChild(template.content.cloneNode(true))
    this.onclick = () => {
      resetState()
    }
  }
}

customElements.define('reset-state-button', ResetStateButton)
