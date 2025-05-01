function sortArrayByField<T extends Record<string, any>>(
    array: T[],
    field: keyof T,
    ascending: boolean = true
): T[] {
    return [...array].sort((a, b) => {
        const aValue = a[field];
        const bValue = b[field];

        if (aValue < bValue) return ascending ? -1 : 1;
        if (aValue > bValue) return ascending ? 1 : -1;
        return 0;
    });
}
