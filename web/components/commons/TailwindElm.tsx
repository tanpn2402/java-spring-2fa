'use client';

import { useEffect } from 'react';

const TailwindElm = () => {
  useEffect(() => {
    const use = async () => {
      // @ts-ignore
      (await import('tw-elements')).default;
    };
    use();
  }, []);

  return <></>
}

export default TailwindElm;