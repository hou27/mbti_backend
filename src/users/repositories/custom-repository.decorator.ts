import { SetMetadata } from '@nestjs/common';

export function CustomRepository(entity: Function): ClassDecorator {
  return SetMetadata('customRepository', entity);
}
