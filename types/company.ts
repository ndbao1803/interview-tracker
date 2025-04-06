export type Company = {
    id: string;
    name: string;
    industry_id?: string | null;
    location?: string | null;
    created_at?: string;
    updated_at?: string;
    logo?: string | null;
    website?: string | null;
    industry?: {
        id: string;
        name: string;
        created_at?: string;
        updated_at?: string;
    } | null;
};
