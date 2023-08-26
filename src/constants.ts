/* eslint-disable @typescript-eslint/no-redeclare */
export const PlayerNumber = {
  One: 'playerOne',
  Two: 'playerTwo',
} as const
export type PlayerNumber = (typeof PlayerNumber)[keyof typeof PlayerNumber]

export const ResultType = {
  Win: 'win',
  Lose: 'lose',
  Tie: 'tie',
} as const
export type ResultType = (typeof ResultType)[keyof typeof ResultType]

export const SelectionType = {
  Rock: 'rock',
  Paper: 'paper',
  Scissors: 'scissors',
  Lizard: 'lizard',
  Spock: 'spock',
} as const
export type SelectionType = (typeof SelectionType)[keyof typeof SelectionType]

export const DefaultIconName = 'default'
export const ComputerIterations = 10
export const ComputerIterationsDelay = 50
