import { describe, expect, test, vi } from 'vitest'
import {
  evalSelection,
  generateRandomNonRepeatingNumbers,
  computerSelectsRandom,
  playThisRound,
} from '../../src/main'
import { SelectionType } from '../../src/constants'
import { State } from '../../src/state'

describe('main functions', () => {
  describe('evalSelection', () => {
    test('should return null if either player has not selected', () => {
      expect(evalSelection(null, null)).toBe(null)
      expect(evalSelection(null, SelectionType.Rock)).toBe(null)
      expect(evalSelection(SelectionType.Lizard, null)).toBe(null)
    })

    test('should return ResultType.Tie if both players have selected the same icon', () => {
      expect(evalSelection(SelectionType.Rock, SelectionType.Rock)).toBe('tie')
      expect(evalSelection(SelectionType.Paper, SelectionType.Paper)).toBe('tie')
      expect(evalSelection(SelectionType.Scissors, SelectionType.Scissors)).toBe('tie')
      expect(evalSelection(SelectionType.Lizard, SelectionType.Lizard)).toBe('tie')
      expect(evalSelection(SelectionType.Spock, SelectionType.Spock)).toBe('tie')
    })

    test('should return ResultType.Win if player one wins', () => {
      expect(evalSelection(SelectionType.Rock, SelectionType.Scissors)).toBe('win')
      expect(evalSelection(SelectionType.Rock, SelectionType.Lizard)).toBe('win')
      expect(evalSelection(SelectionType.Paper, SelectionType.Rock)).toBe('win')
      expect(evalSelection(SelectionType.Paper, SelectionType.Spock)).toBe('win')
      expect(evalSelection(SelectionType.Scissors, SelectionType.Paper)).toBe('win')
      expect(evalSelection(SelectionType.Scissors, SelectionType.Lizard)).toBe('win')
      expect(evalSelection(SelectionType.Spock, SelectionType.Rock)).toBe('win')
      expect(evalSelection(SelectionType.Spock, SelectionType.Scissors)).toBe('win')
      expect(evalSelection(SelectionType.Lizard, SelectionType.Paper)).toBe('win')
      expect(evalSelection(SelectionType.Lizard, SelectionType.Spock)).toBe('win')
    })

    test('should return ResultType.Lose if player one loses', () => {
      expect(evalSelection(SelectionType.Scissors, SelectionType.Rock)).toBe('lose')
      expect(evalSelection(SelectionType.Lizard, SelectionType.Rock)).toBe('lose')
      expect(evalSelection(SelectionType.Rock, SelectionType.Paper)).toBe('lose')
      expect(evalSelection(SelectionType.Spock, SelectionType.Paper)).toBe('lose')
      expect(evalSelection(SelectionType.Paper, SelectionType.Scissors)).toBe('lose')
      expect(evalSelection(SelectionType.Lizard, SelectionType.Scissors)).toBe('lose')
      expect(evalSelection(SelectionType.Rock, SelectionType.Spock)).toBe('lose')
      expect(evalSelection(SelectionType.Scissors, SelectionType.Spock)).toBe('lose')
      expect(evalSelection(SelectionType.Paper, SelectionType.Lizard)).toBe('lose')
      expect(evalSelection(SelectionType.Spock, SelectionType.Lizard)).toBe('lose')
    })
  })

  test('playThisRound should return null if either player has not selected', () => {
    vi.spyOn(State, 'playerOne', 'get').mockReturnValue({
      name: 'Player One',
      isHuman: true,
      score: 0,
      selected: 'paper',
    })
    vi.spyOn(State, 'playerTwo', 'get').mockReturnValue({
      name: 'Player Two',
      isHuman: true,
      score: 0,
      selected: null,
    })
    expect(playThisRound()).toBe(false)
    vi.spyOn(State, 'playerOne', 'get').mockRestore()
    vi.spyOn(State, 'playerTwo', 'get').mockRestore()
  })

  test('should generate random non-repeating numbers', () => {
    expect(() => generateRandomNonRepeatingNumbers(5, 1)).toThrowError()
    expect(generateRandomNonRepeatingNumbers(5, 2)).toHaveLength(5)
    const r = generateRandomNonRepeatingNumbers(50, 2)
    for (let i = 0; i < r.length; i++) {
      expect(r[i]).toBeGreaterThanOrEqual(0)
      expect(r[i]).toBeLessThan(2)
    }
  })

  test('computerSelectsRandom should check if both players are human', () => {
    vi.spyOn(State, 'playerOne', 'get').mockReturnValue({
      name: 'Player One',
      isHuman: true,
      score: 0,
      selected: null,
    })
    vi.spyOn(State, 'playerTwo', 'get').mockReturnValue({
      name: 'Player Two',
      isHuman: true,
      score: 0,
      selected: null,
    })
    expect(computerSelectsRandom()).toBe(false)
    vi.spyOn(State, 'playerTwo', 'get').mockReturnValue({
      name: 'Player Two',
      isHuman: false,
      score: 0,
      selected: null,
    })
    expect(computerSelectsRandom()).toBe(true)
    vi.spyOn(State, 'playerOne', 'get').mockRestore()
    vi.spyOn(State, 'playerTwo', 'get').mockRestore()
  })
})
