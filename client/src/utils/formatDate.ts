export function formatDate(joinDate: string): string {
    const d = new Date(joinDate);
    return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
}