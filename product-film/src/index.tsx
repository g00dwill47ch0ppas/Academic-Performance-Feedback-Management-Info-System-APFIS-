import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {APFISProductFilm, FILM_FRAMES, FILM_FPS} from './product-film';

const Root: React.FC = () => (
  <Composition
    id="APFISProductFilm"
    component={APFISProductFilm}
    durationInFrames={FILM_FRAMES}
    fps={FILM_FPS}
    width={1920}
    height={1080}
  />
);

registerRoot(Root);
