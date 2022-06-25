import { FC, DetailedHTMLProps, HTMLAttributes } from 'react';
import concatStrings from '@/lib/helpers/concatStrings';

const Container: FC<DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>> = (props) => {
  const className = concatStrings(
    'p-3',
    props.className
  );

  return <main {...props} className={className} />;
};

export default Container;