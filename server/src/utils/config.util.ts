

export const JWT_SECRET : string = process.env.JWT_SECRET as string;
export const JWT_EXPIRES_IN : string = process.env.JWT_EXPIRES_IN ?? '1h';
export const DATABASE_URL : string = process.env.DATABASE_URL as string;
export const PORT : number = Number(process.env.PORT) || 3000; 