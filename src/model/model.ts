import type { RoleDetails } from './RoleDetails';

export interface UserInfo {
  name: string;
  resource_bu: string;
  nobody: string;
  jobs: JobsInfo[];
  displayName: string;
  info: Resource;
  givenName: string;
  surname: string;
  jobTitle: string;
  mail: string;
  officeLocation: string;
  department: string;
  managerEmail: string;
}

export interface JobsInfo {
  month: string;
  jobs: JobsExtraDetail[];
  holidays: number;
  days_allocated: number;
  days_forecast: number;
  days_hypo: number;
  days_working: number;
}

export interface Month {
  month: string;
  jobs: JobsExtraDetail[];
  holidays: number;
  days_allocated: number;
  days_forecast: number;
  days_hypo: number;
  days_working: number;
}

export interface JobsExtraDetail {
  customer: string;
  reply_entity: string;
  bu: string;
  job_origin: string;
  contract_type: string;
  job_s_ord_code: string;
  description: string;
  month: string;
  days: string;
  exp_coge: string;
  b_le: string;
  emp: string;
  internal_customer: string;
}

export interface GroupData {
  customer: string;
  code: string;
  description: string;
  role: string;
  role_id: string;
  grade: string;
  roles: { [month: string]: RoleDetails };
}

export class Placeholder {
  public resource = '';

  public role_id = '';

  public displayName = '';

  public customer = '';

  public project = '';

  public code = '';

  public role = '';

  public description = '';

  public monthlyDetails: { [month: string]: RoleDetails } = {};
}

export interface PlaceholderData {
  [mail: string]: Placeholder;
}

export interface Resource {
  resource: string;
  sc: boolean;
  tir: boolean;
  mh: boolean;
}
