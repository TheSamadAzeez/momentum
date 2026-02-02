import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({
    description: 'User password (excluded from responses)',
    writeOnly: true, // writeOnly: true means the property will be included in the request payload but excluded from the response payload
  })
  @Exclude()
  password: string;
}
