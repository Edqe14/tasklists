import Filterable from './types/filterable';

const concatStrings = (...strings: Filterable[]) => strings.filter((s) => !!s).join(' ');

export default concatStrings;