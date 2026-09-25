import { useLocation } from 'react-router-dom';

import type { TLocationState } from '@utils-types';
import type { Location } from 'react-router-dom';

export const useTypedLocation = (): Location<TLocationState> =>
  useLocation() as Location<TLocationState>;
