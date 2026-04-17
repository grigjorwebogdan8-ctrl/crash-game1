export const vibrate = (pattern: number | number[]) => {
  if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
    try {
      window.navigator.vibrate(pattern);
    } catch (e) {
      console.warn('Vibration failed', e);
    }
  }
};
