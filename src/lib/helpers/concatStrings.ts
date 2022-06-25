type Filterable = string | boolean | null | undefined;

const concatStrings = (...strings: Filterable[]) => strings.filter((s) => !!s).join(' ');

export default concatStrings;