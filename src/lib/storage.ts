export function readStore(key:string, storage:'localStorage'|'sessionStorage'='localStorage'):string|null{try{return window[storage].getItem(key);}catch{return null;}}
export function writeStore(key:string,value:string,storage:'localStorage'|'sessionStorage'='localStorage'):boolean{try{window[storage].setItem(key,value);return true;}catch{return false;}}
export function removeStore(key:string,storage:'localStorage'|'sessionStorage'='localStorage'){try{window[storage].removeItem(key);}catch{/* Acceso permanece en memoria. */}}
