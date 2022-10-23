
export class ScrollSpy {
  $menu: Element;
  speed: number;
  easing: 'easeOutSine';
  offset: number;

  constructor(menu: Element, offset?: number, speed?:number, easing?: 'easeOutSine' ) {
    this.$menu = menu
    this.speed = speed || 2000;
    this.easing = easing || 'easeOutSine'
    this.offset = offset || 0;
  }

  scrollToY(targetY = 0) {
    let currentTime = 0
    const scrollTargetY = targetY
    const scrollY = window.scrollY || document.documentElement.scrollTop
    const time = Math.max(
      0.1,
      Math.min(Math.abs(scrollY - scrollTargetY) / this.speed, 0.8)
    )

    const easingEquations = {
      easeOutSine(pos: number) {
        return Math.sin(pos * (Math.PI / 2))
      },

      easeInOutSine(pos: number) {
        return -0.5 * (Math.cos(Math.PI * pos) - 1)
      },

      easeInOutQuint(pos: number) {
        if ((pos /= 0.5) < 1) return 0.5 * pos ** 5
        return 0.5 * ((pos - 2) ** 5 + 2)
      }
    }

    const tick = () => {
      currentTime += 1 / 60

      const p = currentTime / time
      const t = easingEquations[this.easing](p)

      if (p < 1) {
        window.requestAnimationFrame(tick)
        window.scrollTo(0, scrollY + (scrollTargetY - scrollY) * t)
        return
      }

      window.scrollTo(0, scrollTargetY)
    }

    tick()
  }

  menuControl() {
    const $links = this.$menu.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')
    const scrollPos = window.scrollY || document.documentElement.scrollTop

    $links.forEach((link) => {
      const href = link.getAttribute('href');

      if (href) {
        const elemment = document.querySelector<HTMLAnchorElement>(href)

        if (elemment) {
          elemment.offsetTop + this.offset <= scrollPos
          && elemment.offsetTop + elemment.clientHeight + this.offset > scrollPos
          ? link.classList.add('active')
          : link.classList.remove('active');
        }
      }
    })
  }

  animated() {
    const $links = this.$menu.querySelectorAll('a[href^="#"]')
    const self = this

    function control(e: Event) {
      e.preventDefault()
      // @ts-ignore
      const $target = document.querySelector(this.hash)
      self.scrollToY($target.offsetTop)
    }

    $links.forEach((link) => link.addEventListener('click', control))
  }

  init() {
    this.animated()
    document.addEventListener('scroll', () => this.menuControl())
  }
}
