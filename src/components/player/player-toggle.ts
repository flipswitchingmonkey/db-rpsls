import { PlayerNumber } from '../../constants';
import { State, setPlayerIsHuman } from '../../state';

const template = document.createElement('template');
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

.player-title {
  font-size: 1.2rem;
  line-height: 0.8rem;
  font-weight: bold;
  color: #FFF;
  text-decoration: underline;
  font-style: italic;
}
  </style>
  <div class="wrapper">
    <h2 class="player-title">Player One</h2>
    <div class="toggle">
      <span class="player-human">Human</span>
      <span class="player-computer">Computer</span>
    </div>
  </div>
`;

export class PlayerToggle extends HTMLElement {
  player: PlayerNumber;

  constructor() {
    super();
    this.player = this.hasAttribute('data-player')
      ? (this.getAttribute('data-player') as PlayerNumber)
      : PlayerNumber.One;
  }

  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    const clonedTemplate = template.content.cloneNode(true);
    this.shadowRoot?.appendChild(clonedTemplate);
    const title = this.shadowRoot?.querySelector('.player-title');
    if (title != null) {
      title.textContent = `${State[this.player].name}`;
    }
    this.setIsHuman(State[this.player].isHuman);
    this.shadowRoot?.querySelector('.player-human')?.addEventListener('click', () => {
      this.setIsHuman(true);
    });
    this.shadowRoot?.querySelector('.player-computer')?.addEventListener('click', () => {
      this.setIsHuman(false);
    });
  }

  setIsHuman(active: boolean) {
    setPlayerIsHuman(this.player, active);
    if (State[this.player].isHuman) {
      this.shadowRoot?.querySelector('.player-human')?.classList.add('active');
      this.shadowRoot?.querySelector('.player-computer')?.classList.remove('active');
    } else {
      this.shadowRoot?.querySelector('.player-computer')?.classList.add('active');
      this.shadowRoot?.querySelector('.player-human')?.classList.remove('active');
    }
  }
}

customElements.define('player-toggle', PlayerToggle);
