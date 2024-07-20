import { BaseCommandFluentBuilder, ArgOrOption } from './BaseCommandBuilder';

export interface GitCommandFluentBuilder extends BaseCommandFluentBuilder {
  checkout(...args: ArgOrOption[]): this;
  branch(...args: ArgOrOption[]): this;
  add(...args: ArgOrOption[]): this;
  commit(...args: ArgOrOption[]): this;
  push(...args: ArgOrOption[]): this;
  pull(...args: ArgOrOption[]): this;
  merge(...args: ArgOrOption[]): this;
  rebase(...args: ArgOrOption[]): this;
  tag(...args: ArgOrOption[]): this;
  clone(...args: ArgOrOption[]): this;
  fetch(...args: ArgOrOption[]): this;
  init(...args: ArgOrOption[]): this;
  log(...args: ArgOrOption[]): this;
  reset(...args: ArgOrOption[]): this;
  revert(...args: ArgOrOption[]): this;
  show(...args: ArgOrOption[]): this;
  status(...args: ArgOrOption[]): this;
  diff(...args: ArgOrOption[]): this;
  mergeBase(...args: ArgOrOption[]): this;
  cherryPick(...args: ArgOrOption[]): this;
  remote(...args: ArgOrOption[]): this;
  submodule(...args: ArgOrOption[]): this;
  config(...args: ArgOrOption[]): this;
  reflog(...args: ArgOrOption[]): this;
  bisect(...args: ArgOrOption[]): this;
  grep(...args: ArgOrOption[]): this;
  blame(...args: ArgOrOption[]): this;
  addRemote(...args: ArgOrOption[]): this;
  setDefaultOrigin(origin: string): this;
  defaultOrigin(): this;
  setMainBranch(): this;
  mainBranch(): this;
}