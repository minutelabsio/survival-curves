/* eslint-disable */
import { allStats, riskByStage } from '@/lib/lifespan-stats'
import _mapValues from 'lodash/mapValues'
import * as y1810 from './1810'
import * as y1860 from './1860'
import * as y1910 from './1910'
import * as y1960 from './1960'
import * as y2010 from './2010'

export default Object.freeze(_mapValues({
  '1810': y1810,
  '1860': y1860,
  '1910': y1910,
  '1960': y1960,
  '2010': y2010,
}, d => {
  let ret = allStats(d.default)
  ret.riskByStage.late = ret.deathChance.find(a => a[0] == 75)[1]
  ret.maxLifetime = d.maxLifetime
  return ret
}))
