export class SimpleTemplate{
  #textOrStream;
  #data;
  #config = {
    noCarriageReturn: true
  };

  constructor(textOrStream, data){
    this.#textOrStream = textOrStream;
    this.#data = {...data};
  }

  setConfig(config){
    this.#config = config;

    return this;
  }

  updateConfig(config){
    this.#config = {...this.#config, ...config};

    return this;
  }

  setText(text){
    this.#textOrStream = text;

    return this;
  }

  setStream(){
    this.#textOrStream = stream;

    return this;
  }

  setData(data){
    this.#data = {...data};

    return this;
  }

  addData(data){
    this.#data = {...this.#data, ...data};

    return this;
  }

  parse(data){
    const dataToUse = {...this.#data, ...data};

    if(typeof this.#textOrStream === 'string'){
      const regexp = new RegExp(
        `st\{\{(.*?)\}\}|${this.#config.noCarriageReturn ? '\n' :''}`, 
        'g'
      );

      return this.#textOrStream
        .replace(regexp, (match, key)=>{
          if(match === '\n')
            return '';

          dataToUse[key] ?? match
        })
    }


    throw new Error('Not implemented');
  }
}