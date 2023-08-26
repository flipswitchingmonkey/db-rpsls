import { PlayerNumber } from '../constants'
import type { StateUpdatedEvent, PlayerState } from '../state'

const template = document.createElement('template')
template.innerHTML = /* html */ `
  <style>
    .button-column {
      display: flex;
      flex-direction: column;
    }

    @media only screen and (max-width: 800px) {
      .button-column {
        display: flex;
        flex-direction: row;
      }
    }
  </style>
  <div class="button-column">
    <select-card-button data-icon="rock" data-indent="100%"></select-card-button>
    <select-card-button data-icon="paper" data-indent="30%"></select-card-button>
    <select-card-button data-icon="scissors" data-indent="0%"></select-card-button>
    <select-card-button data-icon="lizard" data-indent="30%"></select-card-button>
    <select-card-button data-icon="spock" data-indent="100%"></select-card-button>
  </div>
`

export class PlayerButtonColumn extends HTMLElement {
  player: PlayerNumber
  active: boolean = true

  constructor() {
    super()
    this.player = this.hasAttribute('data-player')
      ? (this.getAttribute('data-player') as PlayerNumber)
      : PlayerNumber.One
    this.attachShadow({ mode: 'open' })
    this.buildColumn()

    window.addEventListener('state-updated', (event): void => {
      if (
        (event as StateUpdatedEvent).detail?.property === this.player &&
        ((event as StateUpdatedEvent).detail?.value as PlayerState).isHuman !== this.active
      ) {
        this.active = ((event as StateUpdatedEvent).detail?.value as PlayerState).isHuman
        this.buildColumn()
      }
    })
  }

  buildColumn() {
    this.shadowRoot?.querySelector('.button-column')?.remove()
    const clonedTemplate = template.content.cloneNode(true)
    ;(clonedTemplate as Element).querySelectorAll('select-card-button').forEach((element) => {
      element.setAttribute('data-player', this.player)
      element.setAttribute('data-active', this.active.toString())
    })
    console.log('buildColumn')
    this.shadowRoot?.appendChild(clonedTemplate)
  }
}

customElements.define('player-button-column', PlayerButtonColumn)
