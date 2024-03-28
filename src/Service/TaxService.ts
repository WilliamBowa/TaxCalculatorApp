import axios from "axios";

const API_URL = 'http://localhost:5001/tax-calculator/tax-year/'

const  getTaxService = async (annualIncome: number, taxYear: number) => { 
    let taxBracket: Array<any> = [0]
    let taxableIncome: number[] = [0]
    let taxPayable: number[] = [0]
    let currentTaxBracket: Object = 0

    let errors = {
        errorMessage: "",
        hasError: false
    };
    
    try {
        console.log("Tax Service is called")

        if(annualIncome && taxYear){
            let requestUrl = API_URL + taxYear; 
            const response = await axios.get(requestUrl);
            
            if(response.status === 200){  
                taxBracket = response.data.tax_brackets;

                for(let index=0; index<taxBracket.length; index++){
                    let currentIndexTaxBracket = taxBracket[index];
                    
                    // find current tax braquet
                    if(annualIncome >= currentIndexTaxBracket.min && annualIncome <= currentIndexTaxBracket.max ){
                       currentTaxBracket = currentIndexTaxBracket
                        
                    // make sure that we are not in first bracket/index 
                        if(index > 0){
                            for(var k=0; k<index; k++){
                                taxableIncome[k] =  taxBracket[k].max - taxBracket[k].min
                                taxPayable[k] = Math.round((taxableIncome[k] * taxBracket[k].rate)*100)/100
                            }

                           break;

                        } else if(index === 0){ // index is 0 - must be in the first bracket no need to loop
                            taxableIncome[index] = annualIncome
                            taxPayable[index] = Math.round((annualIncome * taxBracket[index].rate)*100)/100
                        }
                    }
                }
            };
        }
    }catch(ex: any){
        console.log("Exception : ", ex);
        errors.errorMessage = ex.message;
        errors.hasError = true
    }

    return{
        errors,
        taxPayable,
        taxableIncome,
        currentTaxBracket
    }
}

export default getTaxService;