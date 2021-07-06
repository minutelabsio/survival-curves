import _sumBy from 'lodash/sumBy'
import _findLast from 'lodash/findLast'
import _flatten from 'lodash/flatten'
import _uniqBy from 'lodash/uniqBy'
import _meanBy from 'lodash/meanBy'
import interpolator from '@/lib/interpolator'

function assertMonotonic(data){
  let prev = data[0][1]
  for (let i = 1, l = data.length; i < l; i++){
    let x = data[i][1]
    if (x > prev){ throw new Error(`Error: lifetable data is not monotonic at age ${data[i][0]} (${x})`) }
    prev = x
  }
}

export function calcDeaths(data){
  return data.map((v, i) => [v[0], i ? data[i - 1][1] - v[1] : 0])
}

export function calcDeathAgeExpectation(data){
  let d = calcDeaths(data)
  let tot = _sumBy(d, a => a[1])
  return _sumBy(d, ([age, count]) => age * count) / tot
}

export function getDeathChance(v, i, arr) {
  let chance = 1
  let age = v[0]
  let next = arr[i + 1]
  if (next){
    if (next[1] === 0){
      chance = 1
    } else {
      chance = 1 - Math.min(1, next[1] / v[1])
    }
  }
  return [age, chance]
}

export function longevityStats(data){
  assertMonotonic(data)
  let expectation = calcDeathAgeExpectation(data)
  let afterChildhood = calcDeathAgeExpectation(data.filter(a => a[0] > 1))
  let max = _findLast(data, a => a[1] > 0)[0]
  return {
    expectation
    , afterChildhood
    , max
  }
}

export function deathChance(data, max){
  let d = interpolator(
    _flatten(_uniqBy(data, v => v[1])),
    { useSpline: true }
  )
  return Array(max).fill(1)
    .map((z, age) => [age, d(age)])
    .map(getDeathChance)
    .filter(v => v[0] < max - 1)
}

export function riskByStage(deathChances, cutoff){
  cutoff = cutoff || Math.round(deathChances.length * 0.6)
  let midlife = deathChances.slice(1, cutoff)
  let latelife = deathChances.slice(cutoff)
  return {
    early: deathChances[0][1]
    , mid: _meanBy(midlife, a => a[1])
    , late: _meanBy(latelife, a => a[1])
  }
}

export function allStats(lifetable){
  let ls = longevityStats(lifetable)
  let dc = deathChance(lifetable, ls.max)
  return {
    lifetable
    , longevityStats: ls
    , riskByStage: riskByStage(dc)
    , deathChance: dc
  }
}
