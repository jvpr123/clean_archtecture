import bcrypt from "bcrypt";
import { BcryptAdapter } from "./Bcrypt.adapter";

jest.mock("bcrypt", () => ({
  async hash(): Promise<string> {
    return new Promise((resolve) => resolve("hashed_password"));
  },
}));

interface sutTypes {
  salt: number;
  sut: BcryptAdapter;
}

const makeSUT = (): sutTypes => {
  const salt = 12;
  const sut = new BcryptAdapter(salt);

  return {
    salt,
    sut,
  };
};

describe("Bcrypt Adapter", () => {
  test("Should call bcrypt library with correct values", async () => {
    const { sut, salt } = makeSUT();
    const bcryptSpy = jest.spyOn(bcrypt, "hash");
    await sut.hash("valid_password");

    expect(bcryptSpy).toHaveBeenCalledWith("valid_password", salt);
  });

  test("Should return hashed password on success", async () => {
    const { sut } = makeSUT();
    const hashedPassword = await sut.hash("valid_password");

    expect(hashedPassword).toBe("hashed_password");
  });
});
