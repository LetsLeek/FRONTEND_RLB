import { Person } from "./person";

export interface Keyword {
    id: number | null,
    name: string,
    responsiblePersons: Person[],
    control: string,
    checkedBy: checkedBy | any,
    department: string,
}

export interface checkedBy {
    person: Person,
    date: string,
    department: string,
}