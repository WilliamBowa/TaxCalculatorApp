import axios from 'axios';
import getTaxService from "./TaxService";

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Test tax service', () => {

  describe('Call tax service successful', () => {
    it('Should return required data', async () => {
      const mockTaxYear = 2022
      const mockAnnualIncome = 100000

      const mockDataResp = {
        currentTaxBracket: {max: 100392, min: 50197, rate: 0.205},
        taxPayable: [7529.55],
        taxableIncome: [50197],
        errors: {
          errorMessage: "",
          hasError: false
        }
      }

      const apiMockData = {
        tax_brackets: [
          {
              max: 50197,
              min: 0,
              rate: 0.15
          },
          {
              max: 100392,
              min: 50197,
              rate: 0.205
          },
          {
              max: 155625,
              min: 100392,
              rate: 0.26
          }
        ],
      }

      mockedAxios.get.mockResolvedValue({ 
          data: apiMockData,
          status: 200
        })
      const result = await getTaxService(mockAnnualIncome, mockTaxYear)
      expect(result.errors.hasError).toEqual(false);  
      expect(result.taxPayable).toEqual(mockDataResp.taxPayable); 
      expect(result.taxableIncome).toEqual(mockDataResp.taxableIncome); 
      expect(result.currentTaxBracket).toEqual(mockDataResp.currentTaxBracket); 
    })
  })

  describe('Test tax service unsuccessful', () => {
    it('call tax service with error', async () => {
      const mockTaxYear = 2022
      const mockAnnualIncome = 100000

      const networkError = '"Network Error"';
      (axios.get as jest.Mock).mockRejectedValueOnce(new Error(networkError));
     
      const result = await getTaxService(mockAnnualIncome, mockTaxYear)
      expect(result.errors.hasError).toEqual(true)
      expect(result.errors.errorMessage).toEqual(networkError)
    })
  })
})