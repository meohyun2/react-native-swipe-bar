import React, {useState, useCallback} from 'react';

const useLayout = () => {
  const [size, setSize] = useState<{width: number; height: number}>(null);

  const onLayout = useCallback(event => {
    const {width, height} = event.nativeEvent.layout;
    setSize({width, height});
  }, []);

  return [size, onLayout];
};

export default useLayout;
