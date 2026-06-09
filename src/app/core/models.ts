export interface SelectOption<T = string | number> {
  label: string;
  value: T;
}

export interface ProgramOption {
  label: string;
  code: number;
}

export interface KeyHistoryItem {
  id: string;
  createdAt: string;
  employeeName: string;
  troopsFull: string;
  troopsShort: string;
  programName: string;
  programCode: number;
  installPlace: string;
  unitNumber: string;
  registrationNumber: string;
  registrationKey: string;
  prolongationDate?: string;
  prolongationCode?: string;
}
