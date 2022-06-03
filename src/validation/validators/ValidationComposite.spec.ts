import { MissingParamsError } from "src/presentation/errors/index"
import { ValidationComposite } from "./ValidationComposite"
import { IValidation } from 'src/presentation/protocols/validation.interface'

const makeValidation = (): IValidation => {
    class ValidationStub implements IValidation {
        validate(input: any): Error | undefined {
            return new MissingParamsError("field")
        }
    }

    return new ValidationStub()
}

const makeSUT = (validator: IValidation): ValidationComposite => {
    return new ValidationComposite([validator])
}

describe('Validation Composite', () => {
    test('Should return an error if any validation fails', () => {
        const sut = makeSUT(makeValidation())
        const result = sut.validate({})

        expect(result).toEqual(new MissingParamsError('field'))
    })

    test('Should not return if validations succeed', () => {
        const validation = makeValidation()
        const sut = makeSUT(validation)
        
        jest.spyOn(validation, 'validate').mockReturnValueOnce(undefined)
        const result = sut.validate({ field: 'data' })

        expect(result).toBeFalsy()
    })
})
