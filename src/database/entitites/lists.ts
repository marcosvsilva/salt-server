import { DatabaseTable, Entity, SchemaMapping } from "./database";

export enum StatusList {
    Create = 0,
    InProgress = 1,
    Complete = 2,
    Canceled = 3
}

export interface List extends DatabaseTable {
    name: String;
    status: StatusList;
    total_list: Number;
    discount: Number;
    date_completed: Date;

    //database
    id: number;
    uuid: string;
    createdAt: Date;
    updatedAt: Date;
};

const listColumns: SchemaMapping<List> = {
    id: 'id',
    uuid: 'uuid',
    name: 'name',
    status: 'status',
    total_list: 'total_list',
    discount: 'discount',
    date_completed: 'date_completed',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
}

const listMapping: SchemaMapping<List> = {
    id: 'id',
    uuid: 'uuid',
    name: 'name',
    status: 'status',
    total_list: 'total_list',
    discount: 'discount',
    date_completed: 'date_completed',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
}

const Lists: Entity<List> = {
    name: 'List',
    table_name: 'Lists',
    column: listColumns,
    mapping: listMapping,
    allowed: [listColumns.name, listColumns.status]
}

export default Lists;
