/* eslint-disable */
import { allStats } from '@/lib/lifespan-stats'
import _mapValues from 'lodash/mapValues'
import * as beaver from './beaver'
import * as cat from './cat'
import * as dallMountainSheep from './dall-mountain-sheep'
import * as dog from './dog'
import * as finWhale from './fin-whale'
import * as gopherTortoise from './gopher-tortoise'
import * as herringGull from './herring-gull'
import * as human from './human'
import * as lapwing from './lapwing'
import * as robin from './robin'
import * as turtle from './turtle'
import * as redWolf from './red-wolf'

export default Object.freeze(_mapValues({
  'Humans': human,
  'Beavers': beaver,
  'House Cats': cat,
  'Dall Mountain Sheep': dallMountainSheep,
  'Dogs': dog,
  'Fin Whales': finWhale,
  'Gopher Tortoises': gopherTortoise,
  'Herring Gulls': herringGull,
  'Lapwings': lapwing,
  'Robins': robin,
  'Loggerhead Sea Turtles': turtle,
  'Red Wolves': redWolf
}, d => {
  let ret = allStats(d.default)
  ret.maxLifetime = d.maxLifetime
  return ret
}))
