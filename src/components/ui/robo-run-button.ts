import { playThisRound } from '../../main';
import robot from '../../assets/robot.svg';
import { State } from '../../state';

const template = document.createElement('template');
template.innerHTML = /* html */ `
  <style>
    .robot {
      background-color: transparent;
      border: none;
      width: 80px;
      height: 80px;
      color: #FFF;
    }

    .hidden {
      visibility: hidden;
    }
  </style>
  <button class="robot" title="Run Computer Game">
    <img src="${robot}" id="robot-icon" alt="Robot" />
  </button>
`;

export class RoboRunButton extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(template.content.cloneNode(true));
    this.onclick = () => {
      playThisRound();
    };
    window.addEventListener('state-updated', (): void => {
      if (!State.playerOne.isHuman && !State.playerTwo.isHuman) {
        this.shadowRoot?.querySelector('button')?.classList.remove('hidden');
      } else {
        this.shadowRoot?.querySelector('button')?.classList.add('hidden');
      }
    });
  }
}

customElements.define('robo-run-button', RoboRunButton);
