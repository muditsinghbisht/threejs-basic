export function getPublicPath() {
  if (import.meta.env.PROD) 
    return '/threejs';
  else return '';
}