import type { StateUpdatedEvent } from '../../state';
import { State, resetRound } from '../../state';

const template = document.createElement('template');
template.innerHTML = /* html */ `
  <style>
.modal-container {
  display: flex;
  visibility: hidden;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.25);
  width: 0;
  height: 0;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  opacity: 0;
  transition: opacity 0.25s ease;
}

.modal-visible {
  visibility: visible !important;
  width: 100vw !important;
  height: 100vh !important;
  z-index: 1000;
  opacity: 1;
}

.modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #FFF;
  background-color: #134f55;
  font-size: 2.5rem;
  width: 400px;
  height: 200px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.result-icons {
  display: flex;
  flex-direction: row;
}

.result-icon {
  width: 80px;
  height: 80px;
  padding: 5px 15px;
}


#icon1.tie {
  transform: scale(-1.0, 1.0);
}

#icon1.win {
  transform: scale(-1.1, 1.1);
}

#icon1.lose {
  transform: scale(-0.9, 0.9);
  filter: grayscale(100%);
}

#icon2.win {
  transform: scale(1.1);
}

#icon2.lose {
  transform: scale(0.9);
  filter: grayscale(100%);
}

  </style>
  <div class="modal-container">
    <div class="modal">
      <div class="result-icons">
        <base-svg-button id="icon1" class="result-icon" data-icon="rock"></base-svg-button>
        <base-svg-button id="icon2" class="result-icon" data-icon="paper"></base-svg-button>
      </div>
      <span id="show-result">Result</span>
    </div>
  </div>
`;

export class ShowResult extends HTMLElement {
  constructor() {
    super();
    window.addEventListener('state-updated', (event) => {
      if ((event as StateUpdatedEvent).detail?.property === 'result') {
        this.setResult();
      }
    });
  }

  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    const clonedTemplate = template.content.cloneNode(true);
    this.shadowRoot?.appendChild(clonedTemplate);

    const modal = this.shadowRoot?.querySelector('.modal-container');
    modal?.addEventListener('click', () => {
      resetRound();
      modal.classList.remove('modal-visible');
    });

    this.setResult();
  }

  setResult() {
    if (State.result == null) {
      return;
    }
    const modalContainer = this.shadowRoot?.querySelector('.modal-container');
    const elementResult = this.shadowRoot?.querySelector('#show-result');
    const resultIcons = this.shadowRoot?.querySelector('.result-icons');
    if (resultIcons && elementResult) {
      let classesIcon1 = '';
      let classesIcon2 = '';
      switch (State.result) {
        case 'win':
          classesIcon1 = 'win';
          classesIcon2 = 'lose';
          elementResult.textContent = `${State.playerOne.name} wins!`;
          break;
        case 'lose':
          classesIcon1 = 'lose';
          classesIcon2 = 'win';
          elementResult.textContent = `${State.playerTwo.name} wins!`;
          break;
        case 'tie':
          classesIcon1 = 'tie';
          classesIcon2 = 'tie';
          elementResult.textContent = "It's a tie!";
          break;
      }
      resultIcons.innerHTML = `
        <base-svg-button id="icon1" class="result-icon ${classesIcon1}" data-icon="${State.playerOne.selected}"></base-svg-button>
        <base-svg-button id="icon2" class="result-icon ${classesIcon2}" data-icon="${State.playerTwo.selected}"></base-svg-button>
      `;
    }
    if (modalContainer != null) {
      modalContainer.classList.add('modal-visible');
    }
  }
}

customElements.define('show-result', ShowResult);
