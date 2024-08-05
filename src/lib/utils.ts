import type { IconDefinition as FaIcon } from '@fortawesome/fontawesome-common-types';
import type { Icon as PlotlyIcon } from 'plotly.js';

export function faToPlotly(i: FaIcon): PlotlyIcon {
  const {
    icon: [width, height, _, __, paths]
  } = i;
  const path = Array.isArray(paths) ? paths.join(' ') : paths;
  return { width, height, path };
}
