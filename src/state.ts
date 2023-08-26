import { PlayerNumber, type SelectionType } from './constants'
import type { PlayIconNames } from './icons'

export interface PlayerState {
  name: string
  isHuman: boolean
  score: number
  selected: null | SelectionType | PlayIconNames
}

export interface StateObject {
  playerOne: PlayerState
  playerTwo: PlayerState
  round: number
  result: null | string
  [key: string]: unknown
}

export type StateUpdatedEvent = Event & {
  detail: {
    property: keyof StateObject
    value: unknown
  }
}

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
  round: 0,
  result: null,
}

export const State = new Proxy(stateObject, {
  set: (target, property, value) => {
    if (typeof property === 'string' && property in target) {
      target[property] = value
      window.dispatchEvent(
        new CustomEvent<{
          property: keyof StateObject
          value: unknown
        }>('state-updated', {
          detail: {
            property,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            value,
          },
          bubbles: true,
          composed: true,
        }) as StateUpdatedEvent,
      )
    }
    return true
  },
})

export function setPlayerScore(player: PlayerNumber, score: number) {
  State[player] = { ...State[player], score }
}
export function setPlayerSelectedCard(
  player: PlayerNumber,
  selected: PlayIconNames | SelectionType | null,
) {
  State[player] = { ...State[player], selected }
}
export function setPlayerIsHuman(player: PlayerNumber, isHuman: boolean) {
  State[player] = { ...State[player], isHuman }
}
export function increaseRound() {
  State.round++
}

export function resetRound() {
  State.result = null
  setPlayerSelectedCard(PlayerNumber.One, null)
  setPlayerSelectedCard(PlayerNumber.Two, null)
}
