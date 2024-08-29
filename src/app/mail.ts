import { Person } from "./person";

export interface Mail {
    id: number;
    subject: string;
    receivedDateTime: string;
    from: Person;
    body: {
      content: string,
      contentType: string
    };
    department: string;
    isChecked: Boolean;
  }
  