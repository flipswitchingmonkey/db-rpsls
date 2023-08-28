import { DefaultIconName, PlayerNumber } from '../../constants';
import type { AllIconNames } from '../../icons';
import type { PlayerState, StateUpdatedEvent } from '../../state';
import { BaseSvgButton } from './base-svg-button';

function getStyle(flip: '-' | '') {
  const style = document.createElement('style');
  style.textContent = /* css */ `
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: center;
}

.icon {
  height: 200px;
  width: 200px;
  transform: scale(${flip}1.0, 1.0);
}

svg {
    height: 100%;
    width: 100%;
}

@media only screen and (max-width: 800px) {
  .icon {
    padding: 15px 5px;
    height: 130px;
    width: 130px;
    transform: scale(${flip}1.0, 1.0);
  }
}
`;
  return style;
}

export class SelectedCardButton extends BaseSvgButton {
  constructor() {
    super();
    this.active = true;
    window.addEventListener('state-updated', (event): void => {
      if (
        (event as StateUpdatedEvent).detail?.property === this.player &&
        Boolean((event as StateUpdatedEvent).detail?.value)
      ) {
        const selectedName =
          ((event as StateUpdatedEvent).detail?.value as PlayerState).selected == null
            ? DefaultIconName
            : (((event as StateUpdatedEvent).detail?.value as PlayerState)
                .selected as AllIconNames);
        this.swapIcon(selectedName);
      }
    });
  }

  connectedCallback() {
    const flip = this.player === PlayerNumber.One ? '-' : '';
    super.connectedCallback();
    this.shadowRoot?.append(getStyle(flip));
  }
}

customElements.define('selected-card-button', SelectedCardButton);
