import { parse } from 'date-fns';
const parsed = parse('invalid-date', 'yyyy-MM', new Date());
console.log(isNaN(parsed));
