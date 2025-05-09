import { plainToInstance } from 'class-transformer';

export function toDto<T, V>(dtoClass: new () => T, data: V): T {
  return plainToInstance(dtoClass, data, {
    excludeExtraneousValues: true,
  });
}
