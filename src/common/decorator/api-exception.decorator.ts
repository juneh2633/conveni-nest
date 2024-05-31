import { HttpException, applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export const ApiException = (exception: HttpException) => {
  return applyDecorators(
    ApiResponse({
      status: exception.getStatus(),
      description: exception.message,
    }),
  );
};
