import { PlayerNumber } from '../constants'
import { playThisRound } from '../main'
import { State, setPlayerSelectedCard } from '../state'
import { BaseSvgButton } from './base-svg-button'

function getStyle(side: 'left' | 'right', indent: string, flip: '-' | '', active: boolean) {
  const style = document.createElement('style')
  style.textContent = /* css */ `
  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .icon {
    padding: 10px;
    height: 100px;
    width: 100px;
    margin-${side}: ${indent};
    transform: scale(${flip}1.0, 1.0);
    transition-property: transform;
    transition: 0.2s;
  }
  
  ${
    active
      ? `.icon:hover {
    transform: scale(${flip}1.1, 1.1);
  }`
      : ''
  }
  
  svg {
      height: 100%;
      width: 100%;
  }

  @media only screen and (max-width: 800px) {
    .icon {
      padding: 5px;
      height: 50px;
      width: 50px;
      margin: 0;
      transform: scale(1.0, 1.0);
    }

      ${
        active
          ? `.icon:hover {
    transform: scale(1.1, 1.1);
  }`
          : ''
      }
  }
  `
  return style
}

export class SelectCardButton extends BaseSvgButton {
  constructor() {
    super()
    this.onclick = () => {
      if (!this.active) return
      console.log(`Play icon ${this.iconName} clicked.`)
      setPlayerSelectedCard(this.player, this.iconName)
      playThisRound()
    }
  }

  connectedCallback() {
    this.active = State[this.player].isHuman
    const indent = this.hasAttribute('data-indent')
      ? (this.getAttribute('data-indent') as string)
      : '0'
    const side = this.player === PlayerNumber.One ? 'left' : 'right'
    const flip = this.player === PlayerNumber.One ? '-' : ''
    super.connectedCallback()
    this.shadowRoot?.append(getStyle(side, indent, flip, this.active))
  }
}

customElements.define('select-card-button', SelectCardButton)
