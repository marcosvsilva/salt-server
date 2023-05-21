export type SchemaMapping<T> ={
    [Name in keyof T]: string;
}

export type Entity<T> = {
    // Model name
    name: string;

    // Table name
    table_name: string;

    // Application-level column names
    column: SchemaMapping<T>;

    // Database-level column names
    mapping: SchemaMapping<T>;

    // JSON columns
    json?: string[];

    // Allowed columns in API transactions
    allowed: Array<string | undefined>;
};

export interface DatabaseTable {
    id: number;
    uuid: string;
    createdAt: Date;
    updatedAt: Date;
}
