import { State, isStateObject } from '../state';

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
}

.modal-visible {
  visibility: visible !important;
  width: 100vw !important;
  height: 100vh !important;
  z-index: 1000;
}

.modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #FFF;
  background-color: #134f55;
  font-size: 1rem;
  width: 90%;
  height: 60%;
  overflow: scroll;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

#history {
  position: absolute;
  top: 20px;
}

td {
  padding: 2px 10px;
}

.result-icons {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.result-icon {
  width: 20px;
  height: 20px;
  padding: 5px 5px;
}
  </style>
  <base-button id="show-history">Show History</base-button>
    <div class="modal-container">
      <div class="modal">
        <table id="history">
        </table>
      </div>
  </div>
`;

export class ShowHistory extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    const clonedTemplate = template.content.cloneNode(true);
    this.shadowRoot?.appendChild(clonedTemplate);

    const button = this.shadowRoot?.querySelector('#show-history');
    button?.addEventListener('click', () => {
      this.showHistory();
    });
    const modal = this.shadowRoot?.querySelector('.modal-container');
    modal?.addEventListener('click', () => {
      modal.classList.remove('modal-visible');
    });
  }

  showHistory() {
    if (State.history == null) {
      return;
    }
    const modalContainer = this.shadowRoot?.querySelector('.modal-container');
    const historyList = this.shadowRoot?.querySelector('#history');
    if (modalContainer != null) {
      modalContainer.classList.add('modal-visible');
    }
    if (historyList != null) {
      historyList.innerHTML = '';
      const headerRow = document.createElement('tr');
      headerRow.classList.add('history-row');
      ['Round', 'Played', 'Winner', 'Score'].forEach((item: string) => {
        const th = document.createElement('th');
        th.innerText = item;
        headerRow.appendChild(th);
      });
      historyList.appendChild(headerRow);
      State.history.forEach((item: string) => {
        try {
          const stateSnapShot = JSON.parse(item) as unknown;
          if (isStateObject(stateSnapShot)) {
            let result = '';
            switch (stateSnapShot.result) {
              case 'win':
                result = `${State.playerOne.name}`;
                break;
              case 'lose':
                result = `${State.playerTwo.name}`;
                break;
              case 'tie':
                result = 'A tie!';
                break;
            }

            const tr = document.createElement('tr');
            tr.classList.add('history-row');
            tr.innerHTML = `
            <td>${stateSnapShot.round.toString().padStart(3, '0')}</td>
            <td class="result-icons"><base-svg-button id="icon1" class="result-icon" data-icon="${
              stateSnapShot.playerOne.selected
            }"></base-svg-button>
            vs.
            <base-svg-button id="icon2" class="result-icon" data-icon="${
              stateSnapShot.playerTwo.selected
            }"></base-svg-button></td>
            <td>${result}</td>
            <td>${stateSnapShot.playerOne.score} vs. ${stateSnapShot.playerTwo.score}</td>
            `;
            historyList.appendChild(tr);
          }
        } catch (error) {
          console.error(error);
        }
      });
    }
  }
}

customElements.define('show-history', ShowHistory);
