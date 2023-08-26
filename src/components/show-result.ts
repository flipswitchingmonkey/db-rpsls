import type { StateUpdatedEvent } from '../state'
import { State, resetRound } from '../state'

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
}

.modal-visible {
  visibility: visible !important;
  width: 100vw !important;
  height: 100vh !important;
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
  </style>
  <div class="modal-container">
    <div class="modal">
      <span id="show-result">Test</span>
    </div>
  </div>
`

export class ShowResult extends HTMLElement {
  constructor() {
    super()
    window.addEventListener('state-updated', (event) => {
      if ((event as StateUpdatedEvent).detail?.property === 'result') {
        this.setResult()
      }
    })
  }

  connectedCallback() {
    this.attachShadow({ mode: 'open' })
    const clonedTemplate = template.content.cloneNode(true)
    this.shadowRoot?.appendChild(clonedTemplate)

    const modal = this.shadowRoot?.querySelector('.modal-container')
    modal?.addEventListener('click', () => {
      console.log('click')
      resetRound()
      modal.classList.remove('modal-visible')
    })

    this.setResult()
  }

  setResult() {
    if (State.result == null) {
      return
    }
    const modalContainer = this.shadowRoot?.querySelector('.modal-container')
    const elementResult = this.shadowRoot?.querySelector('#show-result')
    if (modalContainer != null) {
      modalContainer.classList.add('modal-visible')
    }
    if (elementResult != null) {
      switch (State.result) {
        case 'win':
          elementResult.textContent = `${State.playerOne.name} wins!`
          break
        case 'lose':
          elementResult.textContent = `${State.playerTwo.name} wins!`
          break
        case 'tie':
          elementResult.textContent = "It's a tie!"
          break
      }
    }
  }
}

customElements.define('show-result', ShowResult)
