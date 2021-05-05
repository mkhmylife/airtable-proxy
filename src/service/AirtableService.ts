import airtable from 'airtable';
import { AirtableConfig } from '../airtableConfig';
import CacheService from './CacheService';

export default class AirtableService {
    
    private config: AirtableConfig;
    private table: Airtable.Table<any>;
    private cache: CacheService;

    constructor(config: AirtableConfig) {
        this.config = config;
        const base = new airtable({apiKey: process.env.AIRTABLE_KEY}).base(config.base);
        this.table = base(config.table);

        this.cache = new CacheService();
    }

    private async getTableContent() {
        const opts: Airtable.SelectOptions = {
            maxRecords: 1000,
        };
        if (this.config.view) {
            opts.view = this.config.view;
        }
        if (this.config.filter) {
            opts.filterByFormula = this.config.filter;
        }
        if (this.config.fields) {
            opts.fields = this.config.fields;
        }

        const records = await this.table.select(opts).all();
        const mappedRecords = records.map(record => {
            return {
                ...record.fields,
                "Airtable ID": record.id,
            };
        }).map(record => {
            const parsedRecords: any = {
                "Airtable ID": record["Airtable ID"],
            };
            for (const field of this.config.fields.sort()) {
                parsedRecords[field] = record[field] ?? null;            
            }
            return parsedRecords;
        });

        if (this.config.fieldMappings) {
            return this.config.fieldMappings();
        }
        return mappedRecords;
    }

    public async getCachedTableContent() {
        if (!this.cache.has()) {
            console.log(`[cache]: Cache is empty, fetching`, `${new Date()}`);
            const records = await this.getTableContent();
            this.cache.set(records);
            return records;
        }
        if (this.cache.expired()) {
            console.log(`[cache]: Cache is expired, refetching`, `${new Date()}`);
            this.getTableContent().then(records => {
                this.cache.set(records);
                console.log(`[cache]: Cache updated`, `${new Date()}`);
            });
        }
        return this.cache.get();
    }

}