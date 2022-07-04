import shallow from 'zustand/shallow';
import { StoreState } from '../store';

const settingsChanged = (curr: StoreState, prev: StoreState) => !shallow(curr.configuration, prev.configuration);

export default settingsChanged;