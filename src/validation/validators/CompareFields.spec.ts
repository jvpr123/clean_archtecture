import { InvalidParamsError } from "src/presentation/errors/index"
import { CompareFieldsValidation } from "./CompareFields.validator"

const makeSUT = (): CompareFieldsValidation => {
    return new CompareFieldsValidation('field', 'fieldConfirmation')
}

describe('RequiredFields Validation', () => {
    test('Should return a InvalidParamError if validations fails', () => {
        const sut = makeSUT()
        const result = sut.validate({ 
            field: 'data', 
            fieldConfirmation: 'other_data' 
        })
        
        expect(result).toEqual(new InvalidParamsError('fieldConfirmation'))
    })

    test('Should not return if validation succeeds', () => {
        const sut = makeSUT()
        const result = sut.validate({ 
            field: 'data', 
            fieldConfirmation: 'data' 
        })
        
        expect(result).toBeFalsy()
    })
})
