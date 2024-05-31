import { plainToClass } from 'class-transformer';
import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
  validateSync,
} from 'class-validator';
import { EventDto } from 'src/modules/product/dto/request/event.dto';

@ValidatorConstraint({ async: false })
export class IsEventArrayConstraint implements ValidatorConstraintInterface {
  validate(events: any[], args: ValidationArguments) {
    if (!Array.isArray(events)) return false;

    const expectedKeys = ['companyIdx', 'eventIdx', 'eventPrice'];

    return events.every((event) => {
      const eventKeys = Object.keys(event);

      const hasUnexpectedKeys = eventKeys.some(
        (key) => !expectedKeys.includes(key),
      );
      if (hasUnexpectedKeys) {
        return false;
      }

      return (
        typeof event.companyIdx === 'number' &&
        (typeof event.eventIdx === 'number' || event.eventIdx === null) &&
        (typeof event.eventPrice === 'number' || event.eventPrice === null)
      );
    });
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'event array error';
  }
}

export const IsEventArray = (validationOption?: ValidationOptions) => {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOption,
      constraints: [],
      validator: IsEventArrayConstraint,
    });
  };
};
