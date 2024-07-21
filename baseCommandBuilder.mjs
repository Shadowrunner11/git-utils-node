import { spawn, spawnSync } from 'node:child_process';

/**
 * @typedef {import('./types/BaseCommandBuilder').BaseCommandFluentBuilder} BaseFluentBuilder
 * 
 */
export class BaseCommandBuilder{
    /**
     * @type {BaseFluentBuilder['args']}
     */
	#args = []

  #cwd = (typeof process !== 'undefined')? process.cwd() : undefined;

  #env = (typeof process !== 'undefined')? process.env : undefined;

  #onError = 'throw';

  /**
   * @type {import('node:child_process').SpawnOptions}
   */
  #spawnOptions = {
      stdio: 'inherit',
      env: this.#env,
  };


  #command;

    /**
     * 
     * @param {import('./types/BaseCommandBuilder').BaseCommandFluentBuilderOptions} initialOptions
     */
    constructor(initialOptions = {}){
        this.addArgs(...(initialOptions.initialArgs ?? this.#args));

        this.#cwd = initialOptions.cwd ?? this.#cwd;
        this.#env = initialOptions.env ?? this.#env;
        this.#onError = initialOptions.onError ?? this.#onError;
        this.#spawnOptions = initialOptions.spawnOptions ?? this.#spawnOptions;
        this.#command = initialOptions.command ?? this.#command;
    }

    /**
     * @param {import('node:child_process').SpawnOptions} options  
     */
    setSpawnOptions(options){
        this.#spawnOptions = options;

        return this;
    }

    /**
     * @type {BaseFluentBuilder['setCommand']}
     */
    setCommand(command){
      this.#command = command;

      return this;
    }
    
    /**
     * 
     * @param {import('node:child_process').SpawnOptions} options 
     */
    updateSpawnOptions(options){
        this.#spawnOptions = {
            ...this.#spawnOptions,
            ...options
        };

        return this;
    }

    toString(){
      return this.#args.join(' ');
    }

    /**
     * 
     * @param {string} option  
     */
    #transformOptionArg(option){
      return option.length > 1? `--${option}` : `-${option}`;
    }

    #transformOptionToArg(option){
      if(option.value)
        return `${this.#transformOptionArg(option.option)}=${option.value.toString}`;

      return this.#transformOptionArg(option.option);
    }

    /**
     * @type {BaseFluentBuilder['addOption']}
     */
    addOption(option, value){
      this.#args.push(this.#transformOptionToArg({
        option,
        value,
      }));

      return this;
    }

    /**
     * @type {BaseFluentBuilder['addArg']}
     */
    addArg(argOrArs){
      if(Array.isArray(argOrArs)){
        const transformedOptions = argOrArs.map(arg => {
          if(typeof arg === 'string')
            return arg;

          return this.#transformOptionToArg(option);
        })
    
        this.#args.push(...transformedOptions);
      }
      else if(typeof argOrArs === 'string')
        this.#args.push(argOrArs);
      else
        this.addOption(argOrArs.option, argOrArs.value);


      return this;
    }
    
    /**
     * 
     * @type  {BaseFluentBuilder['addArgs']} 
     */
    addArgs(...argOrArs){
      argOrArs.forEach(arg => this.addArg(arg));

      return this;
    };

    /**
     * @type {BaseFluentBuilder['execute']}
     */
    execute(){
      return new Promise((resolve, reject) => {
        const child = spawn(this.#command, this.#args, {
          ...this.#spawnOptions,
          cwd: this.#cwd,
        });

        child.on('close', code => {
          if(code === 0)
            resolve();
          else if(this.#onError === 'throw')
            reject(new Error(`Command failed with code ${code}`));
        });

        child.on('error', err => {
          if(this.#onError === 'throw')
            reject(err);
        });
      });
    };

    /**
     * @type {BaseFluentBuilder['executeSync']}
     */
    executeSync(){
      const { error, ...rest } = spawnSync(this.#command, this.#args, {
        cwd: this.#cwd,
        env: this.#env,
        ...this.#spawnOptions,
      });

      if(error){
        throw error;
      }

      return {
        error,
        ...rest,
      }
    };

    /**
     * @type {BaseFluentBuilder['spawn']}
     */
    spawn(){
      return spawn(this.#command, this.#args, {
        cwd: this.#cwd,
        env: this.#env,
        ...this.#spawnOptions,
      });
    };

    /**
     * @type {BaseFluentBuilder['setCWD']}
     */
    setCWD(cwd){
      this.#cwd = cwd;

      return this;
    }

    /**
     * @type {BaseFluentBuilder['setEnv']}
     */
    setEnv(env){
      this.#env = env;

      return this;
    };

    /**
     * @type {BaseFluentBuilder['onErrorThrow']}
     */
    onErrorThrow(){
      this.#onError = 'throw';

      return this;
    };
    onErrorIgnore(){
      this.#onError = 'ignore';

      return this;
    };

    clone(){
      return new BaseCommandBuilder({
        initialArgs: this.#args,
        cwd: this.#cwd,
        env: this.#env,
        onError: this.#onError,
        spawnOptions: this.#spawnOptions
      })
    }

    static create(options){
      return new BaseCommandBuilder(options);
    }
}
