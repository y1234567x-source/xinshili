import absinthe from './absinthe.jpg';
import ambergris from './ambergris.jpg';
import bergamot from './bergamot.jpg';
import cardamom from './cardamom.jpg';
import cedar from './cedar.jpg';
import clove from './clove.jpg';
import coconut from './coconut.jpg';
import green_apple from './green_apple.jpg';
import green_grass from './green_grass.jpg';
import green_orange from './green_orange.jpg';
import green_tea from './green_tea.jpg';
import jasmine from './jasmine.jpg';
import lavender from './lavender.jpg';
import lemon from './lemon.jpg';
import lily_of_the_valley from './lily_of_the_valley.jpg';
import lotus from './lotus.jpg';
import mimosa from './mimosa.jpg';
import ocean from './ocean.jpg';
import orange_oil from './orange_oil.jpg';
import osmanthus from './osmanthus.jpg';
import patchouli from './patchouli.jpg';
import peach from './peach.jpg';
import rose from './rose.jpg';
import sandalwood from './sandalwood.jpg';
import spearmint from './spearmint.jpg';
import synthetic_musk from './synthetic_musk.jpg';
import vanilla from './vanilla.jpg';
import violet from './violet.jpg';
import white_tea from './white_tea.jpg';

const SCENT_IMAGES: Record<string, string> = {
  absinthe,
  ambergris,
  bergamot,
  cardamom,
  cedar,
  clove,
  coconut,
  green_apple,
  green_grass,
  green_orange,
  green_tea,
  jasmine,
  lavender,
  lemon,
  lily_of_the_valley,
  lotus,
  mimosa,
  ocean,
  orange_oil,
  osmanthus,
  patchouli,
  peach,
  rose,
  sandalwood,
  spearmint,
  synthetic_musk,
  vanilla,
  violet,
  white_tea,
};

export function getScentImage(scentId: string): string | undefined {
  return SCENT_IMAGES[scentId];
}

