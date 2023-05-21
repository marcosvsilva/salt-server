import { DatabaseTable, Entity, SchemaMapping } from "./database";

export declare enum StatusListProduct {
    Create = 0,
    InQueue = 1,
    Bought = 2
}

export interface ListProduct extends DatabaseTable {
    date: Date;
    status: StatusListProduct;

    //database
    id: number;
    uuid: string;
    createdAt: Date;
    updatedAt: Date;
};

const listProductColumns: SchemaMapping<ListProduct> = {
    id: 'id',
    uuid: 'uuid',
    date: 'date',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
}

const listProductMapping: SchemaMapping<ListProduct> = {
    id: 'id',
    uuid: 'uuid',
    date: 'date',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
}

const ListProducts: Entity<ListProduct> = {
    name: 'ListProduct',
    table_name: 'ListProducts',
    column: listProductColumns,
    mapping: listProductMapping,
    allowed: [listProductColumns.status]
}

export default ListProducts;