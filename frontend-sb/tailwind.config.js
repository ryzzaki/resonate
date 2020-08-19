const sizes = {
  '1': '1px',
  '2': '2px',
  '3': '3px',
  '4': '4px',
  '5': '5px',
  '6': '6px',
  '7': '7px',
  '8': '8px',
  '9': '9px',
  '10': '10px',
  '11': '11px',
  '12': '12px',
  '13': '13px',
  '14': '14px',
  '15': '15px',
  '16': '16px',
  '17': '17px',
  '18': '18px',
  '19': '19px',
  '20': '20px',
  '22': '22px',
  '24': '24px',
  '25': '25px',
  '26': '26px',
  '28': '28px',
  '30': '30px',
  '32': '32px',
  '34': '34px',
  '35': '35px',
  '36': '36px',
  '38': '38px',
  '40': '40px',
  '60': '60px',
  '100': '100px',
  '30rem': '30rem',
};

const insets = {
  '1/2': '50%',
  '0': '0',
  '-2': '-2rem',
  '-3': '-3rem',
  '3': '3rem',
  '4': '4rem',
  '5': '5rem',
};

module.exports = {
  prefix: '',
  important: false,
  separator: ':',
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
    colors: {
      transparent: 'transparent',
      black: '#000',
      brownblack: '#242021',
      white: '#fff',
      gray: '#606060',
      darkgray: '#1a202c',
      verydarkgray: '#11141c',
      green: '#1db954',
      lightgreen: '#15d600',
      blue: '#0282eb',
      // yellow100: '#373416',
      // yellow200: '##28240f',
      // yellow300: '#191919',
      skinpink: '#f8ccd2',
      darkskinpink: '#e4a7af',
      pink: '#f453a9',
      darkblue: '#203264',
    },
    fontSize: sizes,
    fontFamily: {
      logoHeading: ['NexaBold', 'sans-serif'],
      heading: ['GothamMedium', 'sans-serif'],
      body: ['MetropolisLight', 'sans-serif'],
      mono: ['NexaBold', 'sans-serif'],
    },
    extend: {
      spacing: sizes,
      maxWidth: sizes,
    },
    inset: insets,
  },
  variants: {
    textColor: ['group-hover'],
    opacity: ['group-hover'],
  },
  plugins: [],
};
