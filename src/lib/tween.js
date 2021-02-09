import TWEEN from '@tweenjs/tween.js'
const registry = {}

function animate(time) {
  requestAnimationFrame(animate)
  TWEEN.update(time)
  for (let t of Object.values(registry)){
    t.update(time)
  }
}

requestAnimationFrame(animate)

const easings = {
  'easeInQuad': TWEEN.Easing.Quadratic.In
  , 'easeOutQuad': TWEEN.Easing.Quadratic.Out
  , 'easeInOutQuad': TWEEN.Easing.Quadratic.InOut
  , 'easeInOutSine': TWEEN.Easing.Sinusoidal.InOut
}

export function getTweenGroup(group = 'default'){
  return registry[group]
}

export function tween({ from, to, delay, duration, step, easing }, group = 'default'){
  return new Promise((resolve, reject) => {
    let state = from
    try {
      let grp = registry[group] = registry[group] || new TWEEN.Group()
      new TWEEN.Tween(state, grp)
        .to(to, duration)
        .delay(delay)
        .easing(easings[easing])
        .onUpdate(() => step(state))
        .onComplete((arg) => {
          resolve(arg)
        })
        .start()
    } catch ( e ) {
      reject(e)
    }
  })
}
