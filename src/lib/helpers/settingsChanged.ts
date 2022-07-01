import { pick } from 'lodash-es';
import shallow from 'zustand/shallow';
import { StoreState } from '../store';
import { settingsDefault } from '../store/adapters/settings';

const settingsChanged = (curr: StoreState, prev: StoreState) => !shallow(pick(curr, Object.keys(settingsDefault)), pick(prev, Object.keys(settingsDefault)));

export default settingsChanged;