/**
 * Formatting dates to DD/MM/YYYY
 */
export const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return '—';
    // dateString format is YYYY-MM-DD
    const [year, month, day] = dateString.split('-');
    if (!year || !month || !day) return dateString;
    return `${day}/${month}/${year}`;
};
