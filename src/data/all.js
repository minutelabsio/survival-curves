/* eslint-disable */
import { allStats } from '@/lib/lifespan-stats'
import _mapValues from 'lodash/mapValues'
import beaver from './beaver'
import cat from './cat'
import dallMountainSheep from './dall-mountain-sheep'
import dog from './dog'
import finWhale from './fin-whale'
import gopherTortoise from './gopher-tortoise'
import herringGull from './herring-gull'
import human from './human'
import lapwing from './lapwing'
import robin from './robin'
import turtle from './turtle'

export default Object.freeze(_mapValues({
  'Beavers': beaver,
  'House Cats': cat,
  'Dall Mountain Sheep': dallMountainSheep,
  'Dogs': dog,
  'Fin Whales': finWhale,
  'Gopher Tortoises': gopherTortoise,
  'Herring Gulls': herringGull,
  'Humans': human,
  'Lapwings': lapwing,
  'Robins': robin,
  'Loggerhead Sea Turtles': turtle,
}, allStats))
