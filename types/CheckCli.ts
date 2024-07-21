import { DiffFilters } from './GitCommandBuilder';

export interface LOCOptions{
  exclude?: string | string[];
  limitTotal?: string | number;
  limitAdded?: string | number;
  throwIfExceed?: boolean;
  report?: 'human' | 'json' | 'html-table' | 'complete';
  limitDeleted?: string | number;
  help?: boolean;
  filters?: Partial<DiffFilters>;
}

export interface CheckOptions extends LOCOptions{

}