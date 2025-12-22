import Address from "./address";

describe("Address unit tests", () => {
  it("should throw error when street is empty", () => {
    expect(() => {
      new Address("", 123, "12345-678", "São Paulo");
    }).toThrowError("address: Street is required");
  });

  it("should throw error when number is zero", () => {
    expect(() => {
      new Address("Rua Principal", 0, "12345-678", "São Paulo");
    }).toThrowError("address: Number is required");
  });

  it("should throw error when zip is empty", () => {
    expect(() => {
      new Address("Rua Principal", 123, "", "São Paulo");
    }).toThrowError("address: Zip is required");
  });

  it("should throw error when city is empty", () => {
    expect(() => {
      new Address("Rua Principal", 123, "12345-678", "");
    }).toThrowError("address: City is required");
  });

  it("should throw error when street and city are invalid", () => {
    expect(() => {
      new Address("", 123, "12345-678", "");
    }).toThrowError("address: Street is required,address: City is required");
  });

  it("should throw error when street and zip are invalid", () => {
    expect(() => {
      new Address("", 123, "", "São Paulo");
    }).toThrowError("address: Street is required,address: Zip is required");
  });

  it("should throw error when number and city are invalid", () => {
    expect(() => {
      new Address("Rua Principal", 0, "12345-678", "");
    }).toThrowError("address: Number is required,address: City is required");
  });

  it("should create a valid address", () => {
    const address = new Address("Rua Principal", 123, "12345-678", "São Paulo");

    expect(address.street).toBe("Rua Principal");
    expect(address.number).toBe(123);
    expect(address.zip).toBe("12345-678");
    expect(address.city).toBe("São Paulo");
  });

  it("should return string representation of address", () => {
    const address = new Address("Rua Principal", 123, "12345-678", "São Paulo");

    expect(address.toString()).toBe("Rua Principal, 123, 12345-678 São Paulo");
  });
});
