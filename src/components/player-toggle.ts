import { PlayerNumber } from '../constants'
import type { StateUpdatedEvent } from '../state'
import { State, setPlayerIsHuman } from '../state'

const template = document.createElement('template')
template.innerHTML = /* html */ `
  <style>
.active {
  color: #FFF;
  font-size: 1.5rem;
  font-weight: bold;
}

.wrapper {
  color: #AAA;
  transition: all 0.5s ease;
  font-size: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.toggle{
  flex-direction: row;
  cursor: pointer;
}

h1 {
  font-size: 1.2rem;
  line-height: 0.8rem;
  font-weight: bold;
  color: #FFF;
  text-decoration: underline;
  font-style: italic;
}
  </style>
  <div class="wrapper">
    <h1 id="title">Player One</h1>
    <div class="toggle">
      <span id="human">Human</span>
      <span id="computer">Computer</span>
    </div>
  </div>
`

export class PlayerToggle extends HTMLElement {
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
    const clonedTemplate = template.content.cloneNode(true)
    this.shadowRoot?.appendChild(clonedTemplate)
    const title = this.shadowRoot?.querySelector('#title')
    if (title != null) {
      title.textContent = `${State[this.player].name}`
    }
    this.setActive(State[this.player].isHuman)
    this.shadowRoot?.querySelector('#human')?.addEventListener('click', () => {
      this.setActive(true)
    })
    this.shadowRoot?.querySelector('#computer')?.addEventListener('click', () => {
      this.setActive(false)
    })
    this.setScore()
  }

  setActive(active: boolean) {
    setPlayerIsHuman(this.player, active)
    if (State[this.player].isHuman) {
      this.shadowRoot?.querySelector('#human')?.classList.add('active')
      this.shadowRoot?.querySelector('#computer')?.classList.remove('active')
    } else {
      this.shadowRoot?.querySelector('#computer')?.classList.add('active')
      this.shadowRoot?.querySelector('#human')?.classList.remove('active')
    }
  }

  setScore() {
    const element = this.shadowRoot?.querySelector('#player-score')
    if (element != null) {
      element.textContent = State[this.player].score.toString()
    }
  }
}

customElements.define('player-toggle', PlayerToggle)
