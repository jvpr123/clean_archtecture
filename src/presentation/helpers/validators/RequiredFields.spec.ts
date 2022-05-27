import { MissingParamsError } from "../../errors"
import { RequiredFieldsValidation } from "./RequiredFields.validator"

const makeSUT = (): RequiredFieldsValidation => {
    return new RequiredFieldsValidation('field')
}

describe('RequiredFields Validation', () => {
    test('Should return a MissingParamError if validations fails', () => {
        const sut = makeSUT()
        const result = sut.validate({})
        
        expect(result).toEqual(new MissingParamsError('field'))
    })

    test('Should not return if validation succeeds', () => {
        const sut = makeSUT()
        const result = sut.validate({ field: 'any' })
        
        expect(result).toBeFalsy()
    })
})
