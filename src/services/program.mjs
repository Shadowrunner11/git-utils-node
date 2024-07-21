// TODO: add method to generate help and description and examples

export class Program{
  #options = {};
  #args = [];
  #actions = {}

  constructor({options, args} = {}){
    this.#options = options ?? this.#options;
    this.#args = args ?? this.#args;
  }

  /**
   * 
   * @param {string} commandName 
   * todo: create interface to execute the command like a Command interface
   * @param {Function} action 
   */
  addAction(commandName, action){
    this.#actions[commandName] = action;

    return this;
  }

  addOptions(options){
    this.#options = {...this.#options, ...options};

    return this;
  }

  checkIfAvailableCommand(actionName){
    if(!this.#actions[actionName]){
      throw new Error(`
        command ${actionName ?? ''} not found
        Available commands: ${Object.keys(this.#actions).join(", ")}
      `);
    }
  }

  // TODO: is this prototype pollution sensible?
  // maybe hte responsibility to clean the inputs should be in a proxy
   executeAction(actionName){
      this.checkIfAvailableCommand(actionName);

      const Action = this.#actions[actionName]; 
      
      if('execute' in Action.prototype){
        return { 
          result: new Action({
            options: this.#options,
            args: this.#args,
            })
            .execute(),
          actionName
        };
      }

      return {result: this.#actions[actionName]({
        options: this.#options,
        args: this.#args,
      }),
      actionName
    };
  }
}
