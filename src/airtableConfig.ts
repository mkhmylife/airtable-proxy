export interface AirtableConfig {
    route: string;
    base: string;
    table: string;
    view?: string;
    filter?: string;
    fields: string[];
    fieldMappings?: Function;
}

export const airtableConfigs: Array<AirtableConfig> = [
    {
        route: "posts",
        base: "app123456",
        table: "Table Name",
        filter: "Status = 'Published'",
        fields: [
            'ID',
            'First Name',
            'Last Name',
            'Content',
        ],
        fieldMappings: ((records: any[]) => {
            return records.map( (record: any) => {
                return {
                    id: record.ID,
                    name: `${record['First Name']} ${record['Last Name']}`,
                    content: record.Content,
                }
            })
        }),
    },
    {
        route: "settings",
        base: "app123456",
        table: "Table Name",
        filter: "Status = 'Published'",
        fields: [
            "Key",
            "Value",
        ],
    },
];