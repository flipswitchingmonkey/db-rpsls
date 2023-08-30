import { PlayerNumber, type SelectionType } from './constants';
import type { AllIconNames } from './icons';

export interface PlayerState {
  name: string;
  isHuman: boolean;
  score: number;
  selected: null | SelectionType | AllIconNames;
}

export interface StateObject {
  playerOne: PlayerState;
  playerTwo: PlayerState;
  round: number;
  result: null | string;
  history: string[];
  [key: string]: unknown;
}

export type StateUpdatedEvent = Event & {
  detail: {
    property: keyof StateObject;
    value: unknown;
  };
};

const stateObject: StateObject = {
  playerOne: {
    name: 'Player One',
    isHuman: true,
    score: 0,
    selected: null,
  },
  playerTwo: {
    name: 'Player Two',
    isHuman: false,
    score: 0,
    selected: null,
  },
  round: 1,
  result: null,
  history: [],
};

export function isStateObject(stateObject: unknown): stateObject is StateObject {
  const candidate = stateObject as StateObject;
  return (
    candidate.playerOne != null &&
    candidate.playerTwo != null &&
    candidate.round != null &&
    candidate.result !== undefined
  );
}

export function loadStateFromLocalStorage() {
  const storedState = localStorage.getItem('state');
  try {
    if (storedState != null) {
      const parsedState = JSON.parse(storedState) as unknown;
      if (isStateObject(parsedState)) {
        Object.assign(stateObject, parsedState);
      }
    }
  } catch {
    // do nothing
  }
}

// on first run, read from localStorage
loadStateFromLocalStorage();

export function saveStateToLocalStorage() {
  stateObject.playerOne.selected = null;
  stateObject.playerTwo.selected = null;
  stateObject.result = null;
  localStorage.setItem('state', JSON.stringify(stateObject));
}

export function resetState() {
  stateObject.playerOne = {
    name: 'Player One',
    isHuman: true,
    score: 0,
    selected: null,
  };
  stateObject.playerTwo = {
    name: 'Player Two',
    isHuman: false,
    score: 0,
    selected: null,
  };
  stateObject.history = [];
  stateObject.round = 1;
  stateObject.result = null;
  // trigger state-updated event
  State.playerOne = stateObject.playerOne;
  State.playerTwo = stateObject.playerTwo;
  State.round = stateObject.round;
  State.result = null;
  saveStateToLocalStorage();
}

export const State = new Proxy(stateObject, {
  set: (target, property, value) => {
    if (typeof property === 'string' && property in target) {
      target[property] = value;
      window.dispatchEvent(
        new CustomEvent<{
          property: keyof StateObject;
          value: unknown;
        }>('state-updated', {
          detail: {
            property,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            value,
          },
          bubbles: true,
          composed: true,
        }) as StateUpdatedEvent,
      );
    }
    return true;
  },
});

export function setPlayerScore(player: PlayerNumber, score: number) {
  State[player] = { ...State[player], score };
}
export function setPlayerSelectedCard(
  player: PlayerNumber,
  selected: AllIconNames | SelectionType | null,
) {
  State[player] = { ...State[player], selected };
}
export function setPlayerIsHuman(player: PlayerNumber, isHuman: boolean, triggerEvent = true) {
  if (triggerEvent) {
    State[player] = { ...State[player], isHuman };
  } else {
    stateObject[player].isHuman = isHuman;
  }
}
export function increaseRound() {
  State.round++;
}

export function resetRound() {
  State.result = null;
  setPlayerSelectedCard(PlayerNumber.One, null);
  setPlayerSelectedCard(PlayerNumber.Two, null);
}

export function snapshotState() {
  const snapshot = JSON.stringify({ ...stateObject, history: [] });
  State.history.push(snapshot);
}
