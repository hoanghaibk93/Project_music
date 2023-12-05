import { PartialType } from '@nestjs/mapped-types';
import { CreateSubcriberDto } from './create-Subcriber.dto';

export class UpdateSubcriberDto extends PartialType(CreateSubcriberDto) { }
