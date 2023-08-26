import type { StateUpdatedEvent } from '../state'
import { State } from '../state'

const template = document.createElement('template')
template.innerHTML = /* html */ `
  <style>
.wrapper {
  color: #FFF;
  transition: all 0.5s ease;
  font-size: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-style: italic;
  margin-top: -80px;
}
  </style>
  <div class="wrapper">
  <span>Round</span>
  <span id="show-round"></span>
  </div>
`

export class ShowRound extends HTMLElement {
  constructor() {
    super()
    window.addEventListener('state-updated', (event) => {
      if ((event as StateUpdatedEvent).detail?.property === 'result') {
        this.setRound()
      }
    })
  }

  connectedCallback() {
    this.attachShadow({ mode: 'open' })
    const clonedTemplate = template.content.cloneNode(true)
    this.shadowRoot?.appendChild(clonedTemplate)
    this.setRound()
  }

  setRound() {
    const elementRound = this.shadowRoot?.querySelector('#show-round')
    if (elementRound != null) {
      elementRound.textContent = State.round > 0 ? State.round.toString() : '-'
    }
  }
}

customElements.define('show-round', ShowRound)
