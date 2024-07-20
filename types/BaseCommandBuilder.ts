import type { spawn, spawnSync, SpawnOptions } from 'node:child_process';

export interface OptionArg{
 option: string;
 value?: string | boolean | number;
}

export type ArgOrOption = string | OptionArg;

export interface BaseCommandFluentBuilderOptions {
    spawnOptions?: SpawnOptions;
    cwd?: string;
    env?: NodeJS.ProcessEnv;
    onError?: 'throw' | 'ignore';
    initialArgs?: Iterable<ArgOrOption>;
}

export interface BaseCommandFluentBuilder {
    args: string[];
    setSpawnOptions(options: SpawnOptions): this;
    toString(): string;
    addArgs(...argOrArs: ArgOrOption[] | ArgOrOption [][]): this;
    execute(): Promise<ReturnType<typeof spawnSync>>;
    executeSync(): ReturnType<typeof spawnSync>;
    spawn(): ReturnType<typeof spawn>;
    addOption(option: OptionArg['option'], value?: OptionArg['value']): this;
    setCWD(cwd: string): this;
    setEnv(env: NodeJS.ProcessEnv): this;
    onErrorThrow(): this;
    onErrorIgnore(): this;
    setOptions(options: BaseCommandFluentBuilderOptions): this;
    clone(): BaseCommandFluentBuilder;
    addArg(argOrArs: ArgOrOption| ArgOrOption[]): this;
}