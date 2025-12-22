import ValidatorInterface from "../../@shared/validator/validator.interface";
import Order from "../entity/order";
import * as yup from "yup";

export default class OrderYupValidator implements ValidatorInterface<Order> {
  validate(entity: Order): void {
    try {
      yup
        .object()
        .shape({
          id: yup.string().required("Id is required"),
          customerId: yup.string().required("CustomerId is required"),
          items: yup.array().min(1, "Items are required"),
        })
        .validateSync(
          {
            id: entity.id,
            customerId: entity.customerId,
            items: entity.items,
          },
          {
            abortEarly: false,
          }
        );
    } catch (errors) {
      const e = errors as yup.ValidationError;
      e.errors.forEach((error) => {
        entity.notification.addError({
          context: "order",
          message: error,
        });
      });
    }

    // Validação adicional para quantidade de items
    if (entity.items && entity.items.some((item) => item.quantity <= 0)) {
      entity.notification.addError({
        context: "order",
        message: "Quantity must be greater than 0",
      });
    }
  }
}
