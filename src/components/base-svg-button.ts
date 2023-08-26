import { DefaultIconName, PlayerNumber } from '../constants.js'
import type { PlayIconNames, SvgIcon } from '../icons.js'
import { PlayIconsSVGs } from '../icons.js'

export class BaseSvgButton extends HTMLElement {
  player: PlayerNumber
  active = true
  iconName: PlayIconNames = DefaultIconName

  constructor() {
    super()
    this.player = this.hasAttribute('data-player')
      ? (this.getAttribute('data-player') as PlayerNumber)
      : PlayerNumber.One
  }

  static elementFromPlayIcon(rootElement: Element, playIcon: SvgIcon, active: boolean) {
    const color = active ? playIcon.fillColor : playIcon.fillColorInactive
    const icon = rootElement.appendChild(document.createElement('span'))
    icon.setAttribute('class', 'icon')
    icon.setAttribute('tabindex', '0')

    const svg = icon.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'svg'))
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
    svg.setAttribute('viewBox', playIcon.viewBox)

    const circle = svg.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'circle'))
    circle.setAttribute('cx', '50%')
    circle.setAttribute('cy', '50%')
    circle.setAttribute('r', '45%')
    circle.setAttribute('stroke', color)
    circle.setAttribute('stroke-width', '30')
    circle.setAttribute('fill', '#046e7b')

    const path = svg.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'path'))
    path.setAttribute('d', playIcon.path)
    path.setAttribute('fill', color)
    path.setAttribute('stroke-width', '20')
    path.setAttribute('transform', `scale(0.6 0.6) translate(${playIcon.xoffset ?? '150'} 180)`)
    return icon
  }

  swapIcon(newIconName: PlayIconNames) {
    this.iconName = newIconName
    const playIcon = PlayIconsSVGs[this.iconName]
    const wrapper = this.shadowRoot?.querySelector('.wrapper')
    const icon = this.shadowRoot?.querySelector('.icon')
    if (icon != null) {
      icon.remove()
    }
    // yes, two == is correct here
    if (wrapper == null) {
      return false
    }
    BaseSvgButton.elementFromPlayIcon(wrapper, playIcon, this.active)
    return true
  }

  connectedCallback() {
    this.attachShadow({ mode: 'open' })

    const wrapper = document.createElement('span')
    wrapper.setAttribute('class', 'wrapper')

    const dataIcon = this.hasAttribute('data-icon')
      ? (this.getAttribute('data-icon') as PlayIconNames)
      : DefaultIconName

    this.shadowRoot?.append(wrapper)

    if (!this.swapIcon(dataIcon)) {
      return
    }

    this.shadowRoot?.append(wrapper)
  }
}

customElements.define('base-svg-button', BaseSvgButton)
