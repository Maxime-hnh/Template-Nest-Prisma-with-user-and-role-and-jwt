import { plainToInstance } from "class-transformer";

export function toDtos<T, V>(dtoClass: new () => T, data: V[]): T[] {
  return data.map(item =>
    plainToInstance(dtoClass, item, { excludeExtraneousValues: true })
  );
}