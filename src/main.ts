import {
  ComputerIterations,
  ComputerIterationsDelay,
  ResultType,
  SelectionType,
} from './constants';
import type { AllIconNames } from './icons';
import { State, increaseRound, saveStateToLocalStorage, snapshotState } from './state';

export function playThisRound(): boolean {
  State.result = null;
  if (
    (State.playerOne.isHuman && State.playerOne.selected == null) ||
    (State.playerTwo.isHuman && State.playerTwo.selected == null)
  ) {
    console.log('Both players must select an icon before playing a round.');
    return false;
  }
  computerSelectsRandom();
  return true;
}

/**
 * Calculates the result of the current round from the perspective of player one.
 * Follows the rules of Rock, Paper, Scissors, Lizard, Spock as described here:
 * https://en.wikipedia.org/wiki/Rock_paper_scissors#Additional_weapons
 */
export function evalCurrentState(): void {
  const currentResult = evalSelection(State.playerOne.selected, State.playerTwo.selected);
  State.result = currentResult;
  if (currentResult === null) {
    return;
  }
  if (currentResult === ResultType.Win) {
    State.playerOne = { ...State.playerOne, score: State.playerOne.score + 1 };
  } else if (currentResult === ResultType.Lose) {
    State.playerTwo = { ...State.playerTwo, score: State.playerTwo.score + 1 };
  }
  snapshotState();
  increaseRound();
  saveStateToLocalStorage();
}

export function evalSelection(
  p1: SelectionType | AllIconNames | null,
  p2: SelectionType | AllIconNames | null,
): ResultType | null {
  // early return if either player has not selected
  if (p1 == null || p2 == null) {
    return null;
  }

  // early return if both players have selected the same icon
  if (p1 === p2) {
    return ResultType.Tie;
  }

  switch (p1) {
    case SelectionType.Rock:
      switch (p2) {
        case SelectionType.Scissors:
        case SelectionType.Lizard:
          return ResultType.Win;
        case SelectionType.Paper:
        case SelectionType.Spock:
          return ResultType.Lose;
      }
      break;
    case SelectionType.Paper:
      switch (p2) {
        case SelectionType.Rock:
        case SelectionType.Spock:
          return ResultType.Win;
        case SelectionType.Scissors:
        case SelectionType.Lizard:
          return ResultType.Lose;
      }
      break;
    case SelectionType.Scissors:
      switch (p2) {
        case SelectionType.Paper:
        case SelectionType.Lizard:
          return ResultType.Win;
        case SelectionType.Rock:
        case SelectionType.Spock:
          return ResultType.Lose;
      }
      break;
    case SelectionType.Spock:
      switch (p2) {
        case SelectionType.Rock:
        case SelectionType.Scissors:
          return ResultType.Win;
        case SelectionType.Paper:
        case SelectionType.Lizard:
          return ResultType.Lose;
      }
      break;
    case SelectionType.Lizard:
      switch (p2) {
        case SelectionType.Paper:
        case SelectionType.Spock:
          return ResultType.Win;
        case SelectionType.Rock:
        case SelectionType.Scissors:
          return ResultType.Lose;
      }
      break;
  }
  return null;
}

export function generateRandomNonRepeatingNumbers(length: number, max: number): number[] {
  if (max < 2) {
    throw new Error('max must be greater than 1');
  }
  const arr: number[] = [];
  while (arr.length < length) {
    const num = Math.floor(Math.random() * max);
    if (arr[arr.length - 1] !== num) {
      arr.push(num);
    }
  }
  return arr;
}

/**
 * Selects a random icon for each computer player, and evaluates the current state.
 * Returns true if either player is a computer, false otherwise.
 * @returns {boolean}
 */
export function computerSelectsRandom(): boolean {
  // if both players are human, evaluate the current state immediately
  if (State.playerOne.isHuman && State.playerTwo.isHuman) {
    evalCurrentState();
    return false;
  }
  let counter = 0;
  const maxIterations = ComputerIterations;
  const selectionValues = Object.values(SelectionType);
  const randomSelectionIndexes1 = generateRandomNonRepeatingNumbers(
    maxIterations,
    selectionValues.length,
  );
  const randomSelectionIndexes2 = generateRandomNonRepeatingNumbers(
    maxIterations,
    selectionValues.length,
  );
  const interval = setInterval(() => {
    if (!State.playerOne.isHuman) {
      State.playerOne = {
        ...State.playerOne,
        selected: selectionValues[randomSelectionIndexes1[counter] as number] as SelectionType,
      };
    }
    if (!State.playerTwo.isHuman) {
      State.playerTwo = {
        ...State.playerTwo,
        selected: selectionValues[randomSelectionIndexes2[counter] as number] as SelectionType,
      };
    }
    counter++;
    if (counter >= maxIterations) {
      clearInterval(interval);
      evalCurrentState();
    }
  }, ComputerIterationsDelay);
  return true;
}
