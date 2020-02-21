import MobileDetect from 'mobile-detect';

export const HOST = 'http://localhost:3000';
export const WITH_AUTH = true;

const md = new MobileDetect(window.navigator.userAgent);

export const isMobile = !!md.mobile();
