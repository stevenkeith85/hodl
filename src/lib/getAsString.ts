export const getAsString = (param): string | null => Array.isArray(param) ? param[0] : param;
