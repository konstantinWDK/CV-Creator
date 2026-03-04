export const formatMonthYear = (dateString) => {
    if (!dateString) return '';
    const parts = dateString.split('-');
    if (parts.length !== 2) return dateString;
    const [year, month] = parts;

    const date = new Date(year, parseInt(month) - 1);
    const formatted = date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

export const formatPeriod = (start, end) => {
    const s = formatMonthYear(start);
    const e = end ? formatMonthYear(end) : 'Presente';
    if (!s && !end) return '';
    if (!s) return e;
    return `${s} - ${e}`;
};

export const calculateDuration = (start, end) => {
    if (!start) return '';
    try {
        const [startYear, startMonth] = start.split('-');
        if (!startYear || !startMonth) return '';

        const startDate = new Date(startYear, parseInt(startMonth) - 1);

        let endDate;
        if (end) {
            const [endYear, endMonth] = end.split('-');
            if (!endYear || !endMonth) return '';
            endDate = new Date(endYear, parseInt(endMonth) - 1);
        } else {
            endDate = new Date();
        }

        let totalMonths = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth()) + 1;

        if (totalMonths <= 0) return '';

        const years = Math.floor(totalMonths / 12);
        const months = totalMonths % 12;

        let result = [];
        if (years > 0) result.push(`${years} ${years === 1 ? 'año' : 'años'}`);
        if (months > 0) result.push(`${months} ${months === 1 ? 'mes' : 'meses'}`);

        return result.length > 0 ? result.join(' y ') : '';
    } catch (e) {
        return '';
    }
};
