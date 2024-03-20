import axios from "axios";

const  getTaxService = async (annualIncome, taxYear) => { 
    var taxBracket = [];
    var totalIncomeTax= 0;
    var data = {
        taxYear: "",
        annualIncome: "",
        totalIncomeTax: "",
        effectiveTaxRate: "",
        currentBandTaxRate: "",
        previousBandTaxRate: "",
        taxRate: "",
        errorMessage: "",
        hasError: false
    };
    
    try {
        console.log("Entering Tax Service", { annualIncome, taxYear});
        
        if(annualIncome !== "" && taxYear !== ""){
            var requestUrl = `http://localhost:5001/tax-calculator/tax-year/${taxYear}`; 

            const response = await axios.get(requestUrl);
            if(response!== response.error){
                taxBracket = response.data.tax_brackets;

                for(var index=0; index<taxBracket.length; index++){
                    var currentTaxBracket = taxBracket[index];
                    var j, previousTaxBracket = 0

                    // find current tax braquet
                   if(annualIncome >= currentTaxBracket.min && annualIncome <= currentTaxBracket.max ){
                       console.log("current TaxBracket: ", currentTaxBracket);
                        
                        //find previous maxIncome band  
                        if(index > 0){ // you pass the first tax bracket
                            j= index-1;
                            previousTaxBracket = taxBracket[j];
                            
                            //Rates
                            var currentTaxBracketRate = currentTaxBracket.rate
                            var previousTaxBracketRate = previousTaxBracket.rate 

                            // Income / income tax
                            var incomeTaxPreviousBand = previousTaxBracket.max * previousTaxBracket.rate
                            var incomeCurrentBand =  annualIncome - previousTaxBracket.max 
                            var incomeTaxCurrentBand = incomeCurrentBand * currentTaxBracketRate

                            totalIncomeTax = incomeTaxPreviousBand + incomeTaxCurrentBand
                            var effectiveTaxRate = totalIncomeTax % annualIncome          // tax payable / income
                            
                            data.totalIncomeTax = totalIncomeTax;
                            data.effectiveTaxRate = effectiveTaxRate;
                            data.currentBandTaxRate = currentTaxBracketRate;
                            data.previousBandTaxRate = previousTaxBracketRate;
                            //console.log("ser data loop: ", data)

                        }else{ // you fall in the first tax bracket, no need to look at the previous bracket
                            totalIncomeTax = annualIncome * currentTaxBracket.rate; 
                            data.totalIncomeTax = totalIncomeTax;
                            data.effectiveTaxRate = totalIncomeTax % annualIncome  ;
                            data.currentBandTaxRate = currentTaxBracketRate;
                        }
                    }
                }
            };
        }
    }catch(ex){
        console.log("Exception : ", ex);
        data.errorMessage = ex.message;
        data.hasError = true
    }

    return{
        data
    }
}

export default getTaxService;