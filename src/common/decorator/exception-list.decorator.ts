import { HttpException, applyDecorators } from '@nestjs/common';
import { ApiException } from './api-exception.decorator';

export const ExceptionList = (exceptionList: HttpException[]) => {
  const decorators = [];
  exceptionList.forEach((exception) => {
    decorators.push(ApiException(exception));
  });
  return applyDecorators(...decorators);
};
