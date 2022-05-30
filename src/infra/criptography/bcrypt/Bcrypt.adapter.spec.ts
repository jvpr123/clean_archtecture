import bcrypt from "bcrypt";
import { BcryptAdapter } from "./Bcrypt.adapter";

jest.mock("bcrypt", () => ({
  async hash(): Promise<string> {
    return new Promise((resolve) => resolve("hashed_password"));
  },

  async compare(): Promise<boolean> {
    return new Promise((resolve) => resolve(true))
  }
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
  test("Should call hash with correct values", async () => {
    const { sut, salt } = makeSUT();
    const hashSpy = jest.spyOn(bcrypt, "hash");
    await sut.hash("valid_password");

    expect(hashSpy).toHaveBeenCalledWith("valid_password", salt);
  });

  test("Should return hashed password on success", async () => {
    const { sut } = makeSUT();
    const hashedPassword = await sut.hash("valid_password");

    expect(hashedPassword).toBe("hashed_password");
  });
  
  test("Should call compare with correct values", async () => {
    const { sut } = makeSUT();
    const compareSpy = jest.spyOn(bcrypt, "compare");

    await sut.compare("valid_password", "hashed_password");

    expect(compareSpy).toHaveBeenCalledWith("valid_password", "hashed_password");
  });

  test("Should return true if compare succeeds", async () => {
    const { sut } = makeSUT();
    const isValidPassword = await sut.compare("valid_password", "hashed_password");

    expect(isValidPassword).toBe(true);
  });
});
