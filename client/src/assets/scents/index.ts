import ambergris from './ambergris.jpg';
import cardamom from './cardamom.jpg';
import cedar from './cedar.jpg';
import clove from './clove.jpg';
import coconut from './coconut.jpg';
import green_orange from './green_orange.jpg';
import green_tea from './green_tea.jpg';
import jasmine from './jasmine.jpg';
import lemon from './lemon.jpg';
import lily_of_the_valley from './lily_of_the_valley.jpg';
import mimosa from './mimosa.jpg';
import osmanthus from './osmanthus.jpg';import peach from './peach.jpg';
import rose from './rose.jpg';
import sandalwood from './sandalwood.jpg';
import synthetic_musk from './synthetic_musk.jpg';
import violet from './violet.jpg';
import white_tea from './white_tea.jpg';

const SCENT_IMAGES: Record<string, string> = {
  ambergris,
  cardamom,
  cedar,
  clove,
  coconut,
  green_orange,
  green_tea,
  jasmine,
  lemon,
  lily_of_the_valley,
  mimosa,
  osmanthus,  peach,
  rose,
  sandalwood,
  synthetic_musk,
  violet,
  white_tea,
};

export function getScentImage(scentId: string): string | undefined {
  return SCENT_IMAGES[scentId];
}
