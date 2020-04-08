import MobileDetect from 'mobile-detect';

// export const HOST = 'http://localhost:3030';
export const HOST = 'http://106.52.97.183:3030';
export const WITH_AUTH = true;

const md = new MobileDetect(window.navigator.userAgent);

export const isMobile = !!md.mobile();
