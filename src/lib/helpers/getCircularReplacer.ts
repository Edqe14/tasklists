const getCircularReplacer = () => {
  const seen = new WeakSet();

  return (key: string, value: unknown) => {
    if (key.startsWith('_')) return;
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) return;

      seen.add(value);
    }

    return value;
  };
};

export default getCircularReplacer;