import { Keyword } from "./keyword";

export interface Check {
    id: number,
    date: string,
    state: string,
    isChecked: boolean,
    keyWords: Keyword[],
    remark: string,
    department: string,
}


