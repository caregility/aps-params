export interface SchemaField {
    key: string;
    label: string;
    type: "text" | "number" | "dropdown" | "table";
    defaultValue?: any;
    options?: string[];
    columns?: SchemaField[]; // For nested table columns
    hideIf?: { field: string; equals: any };
    showIf?: { field: string; equals: any };
    prepopulateFrom?: string;
}

export interface ClassSchema {
    id: string;
    label: string;
    fields?: SchemaField[];
    hasRecords?: boolean;
    subClasses?: ClassSchema[];
}

export interface AllSchemas {
    classes: ClassSchema[];
}


// A generic record is just an object.
export interface GenericRecord {
    [key: string]: any;
}