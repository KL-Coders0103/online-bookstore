const validateCreateOrder = (req, res, next) => {
  const { items, shippingAddress } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      message: "Order must contain at least one item",
    });
  }

  for (const item of items) {
    if (!item.bookId) {
      return res.status(400).json({
        message: "Each order item must contain a bookId",
      });
    }

    if (
      !Number.isInteger(item.quantity) ||
      item.quantity < 1
    ) {
      return res.status(400).json({
        message: "Each item quantity must be a positive integer",
      });
    }
  }
  
  const bookIds = items.map((item) => item.bookId);

  const uniqueBookIds = new Set(bookIds);

  if (uniqueBookIds.size !== bookIds.length) {
    return res.status(400).json({
      message: "Duplicate books are not allowed in an order",
    });
  }
  
  if (!shippingAddress || typeof shippingAddress !== "object") {
    return res.status(400).json({
      message: "Shipping address is required",
    });
  }


  const requiredAddressFields = [
    "fullName",
    "addressLine1",
    "city",
    "state",
    "postalCode",
    "country",
  ];

  for (const field of requiredAddressFields) {
    if (
      !shippingAddress[field] ||
      typeof shippingAddress[field] !== "string" ||
      !shippingAddress[field].trim()
    ) {
      return res.status(400).json({
        message: `${field} is required`,
      });
    }
  }

  next();
};

const validateUpdateOrderStatus = (req, res, next) => {
  const { status } = req.body;

  const allowedStatuses = [
    "pending",
    "confirmed",
    "shipped",
    "delivered",
    "cancelled",
  ];

  if (!status || !allowedStatuses.includes(status)) {
    return res.status(400).json({
      message: "Invalid order status",
    });
  }

  next();
};

module.exports = {validateCreateOrder, validateUpdateOrderStatus};