export function getProp(propName){
  return (object)=>object[propName];
}

export function splitBy(separator){
  return (str)=>str.split(separator);
}

export function throwIf(condition, messageOrError){
  if(typeof messageOrError === "string"){
      messageOrError = new Error(messageOrError);
  }
  
  if(condition){
    throw messageOrError;
  }
}