import { PlayerNumber } from '../constants'
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
  align-self: center;
  align-items: center;
  justify-items: center;
  font-size: 1.3rem;
  font-style: italic;
}
  </style>
  <div class="wrapper">
    <div>Score</div>
    <span id="player-score"></span>
  </div>
`

export class PlayerScore extends HTMLElement {
  player: PlayerNumber

  constructor() {
    super()
    this.player = this.hasAttribute('data-player')
      ? (this.getAttribute('data-player') as PlayerNumber)
      : PlayerNumber.One
    window.addEventListener('state-updated', (event) => {
      if ((event as StateUpdatedEvent).detail?.property === this.player) {
        this.setScore()
      }
    })
  }

  connectedCallback() {
    this.attachShadow({ mode: 'open' })
    // const wrapper = document.createElement('span')
    // wrapper.setAttribute('class', 'wrapper')
    // this.shadowRoot?.appendChild(wrapper)
    const clonedTemplate = template.content.cloneNode(true)
    this.shadowRoot?.appendChild(clonedTemplate)
    this.setScore()
  }

  setScore() {
    const element = this.shadowRoot?.querySelector('#player-score')
    if (element != null) {
      element.textContent = State[this.player].score.toString()
    }
  }
}

customElements.define('player-score', PlayerScore)
