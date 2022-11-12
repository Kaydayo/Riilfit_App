import {
    ArgumentMetadata,
    BadRequestException,
    HttpException,
    HttpStatus,
    Injectable,
    PipeTransform,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class RequestPayloadValidator implements PipeTransform<any> {
    async transform(value, metadata: ArgumentMetadata) {
        if (!value) {
            throw new BadRequestException('No data submitted');
        }

        const { metatype } = metadata;
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }
        const object = plainToClass(metatype, value);
        const errors = await validate(object);
        if (errors.length > 0) {
            throw new BadRequestException(this.buildError(errors));
        }
        return value;
    }

    private buildError(errors) {
        let error = '';
        errors.forEach(el => {
            const prop = el.property;
            Object.entries(el.constraints).forEach(constraint => {
                error = el.constraints[constraint[0]];
                return;
            });
            return;
        });
        return { success: false, payload: {}, message: error };
    }

    private toValidate(metatype): boolean {
        const types = [String, Boolean, Number, Array, Object];
        return !types.find(type => metatype === type);
    }
}
