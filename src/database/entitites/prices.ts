import { DatabaseTable, Entity, SchemaMapping } from "./database";

export interface Price extends DatabaseTable {
    date: Date;
    price: number;

    //database
    id: number;
    uuid: string;
    createdAt: Date;
    updatedAt: Date;
};

const priceColumns: SchemaMapping<Price> = {
    id: 'id',
    uuid: 'uuid',
    date: 'date',
    price: 'price',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
}

const priceMapping: SchemaMapping<Price> = {
    id: 'id',
    uuid: 'uuid',
    date: 'date',
    price: 'price',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
}

const Prices: Entity<Price> = {
    name: 'Price',
    table_name: 'Prices',
    column: priceColumns,
    mapping: priceMapping,
    allowed: [priceColumns.date]
}

export default Prices;
