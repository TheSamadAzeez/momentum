import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance, ClassConstructor } from 'class-transformer';

interface ResponseWrapper<T> {
  status?: string;
  message?: string;
  data: T | T[];
}

function isResponseWrapper(value: unknown): value is ResponseWrapper<unknown> {
  return value !== null && typeof value === 'object' && 'data' in value;
}

// Decorator to apply the interceptor
export function Serialize<T>(dto: ClassConstructor<T>) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor<T> implements NestInterceptor {
  constructor(private dto: ClassConstructor<T>) {}

  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    return handler.handle().pipe(
      map((response: unknown) => {
        // Check if the response has a 'data' property (nested structure)
        if (isResponseWrapper(response)) {
          // Transform only the nested 'data' property
          return {
            ...response,
            data: plainToInstance(this.dto, response.data, {
              excludeExtraneousValues: false,
            }),
          };
        }

        // Otherwise, transform the entire response
        return plainToInstance(this.dto, response, {
          excludeExtraneousValues: false,
        });
      }),
    );
  }
}

// import {
//   UseInterceptors,
//   NestInterceptor,
//   ExecutionContext,
//   CallHandler,
// } from '@nestjs/common';
// import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';
// import { plainToInstance, ClassConstructor } from 'class-transformer';

// // Decorator to apply the interceptor
// export function Serialize<T>(dto: ClassConstructor<T>) {
//   return UseInterceptors(new SerializeInterceptor(dto));
// }

// export class SerializeInterceptor<T> implements NestInterceptor {
//   constructor(private dto: ClassConstructor<T>) {}

//   intercept(context: ExecutionContext, handler: CallHandler): Observable<T> {
//     return handler.handle().pipe(
//       map((data: unknown) => {
//         // Transform the response data using class-transformer
//         // This will exclude any fields marked with @Exclude() in the DTO
//         return plainToInstance(this.dto, data, {
//           excludeExtraneousValues: false,
//         });
//       }),
//     );
//   }
// }
