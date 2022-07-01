import { isEqual, pick } from 'lodash-es';
import { StoreState } from '../store';
import { settingsDefault } from '../store/adapters/settings';

const settingsChanged = (curr: StoreState, prev: StoreState) => !isEqual(pick(curr, Object.keys(settingsDefault)), pick(prev, Object.keys(settingsDefault)));

export default settingsChanged;