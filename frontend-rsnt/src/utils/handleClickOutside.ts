import { useEffect } from 'react';

export default (ref, func) => {
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!ref.current || ref.current.contains(e.target)) return;
      func(e);
    };

    window.addEventListener('click', handleClickOutside, true);

    return () => window.removeEventListener('click', handleClickOutside, true);
  }, [ref, func]);
};
