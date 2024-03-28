/**
  * getOwnedTax() helper service returns:
  * totalTaxPayable, effective rate and taxPayableperBand which appends taxpayable current band to the array
  */
export const getOwnedTax = (formData: any, taxService: any) => {
    var currentTaxBracket = taxService.currentTaxBracket
    var taxableIncomeBands = taxService.taxableIncome
    var taxPayablePerBand = taxService.taxPayable
    var taxPayableLeft, taxableIncomeLeft, totalTaxPayable, effectiveRate, totalAnnualIncome = 0
    var totalTaxableIncomePreviousBands:number = 0;
    var totalTaxPayablePreviousBands = 0;

    //get taxPayableLeft from remaining taxableIcome 
    for(var i=0; i<taxableIncomeBands.length; i++){ 
        totalTaxableIncomePreviousBands += taxableIncomeBands[i]
    }

    taxableIncomeLeft = formData.annualIncome - totalTaxableIncomePreviousBands 
    taxPayableLeft = taxableIncomeLeft * currentTaxBracket.rate
    totalAnnualIncome = taxableIncomeLeft + totalTaxableIncomePreviousBands  // should be eq to annual income

    // get total taxPayable
    for(var j=0; j<taxPayablePerBand.length; j++){
        totalTaxPayablePreviousBands += taxPayablePerBand[j]
    }

    totalTaxPayable = totalTaxPayablePreviousBands + taxPayableLeft

    // get all tax payable/own per band including last bracket
    var taxOwnedperBandLenght = taxPayablePerBand.length
    if(taxOwnedperBandLenght >= 1 && taxPayableLeft !== 0) {
        taxPayablePerBand[taxOwnedperBandLenght] = taxPayableLeft
    }
    // get effective rate 
    effectiveRate = Math.round((totalTaxPayable / formData.annualIncome) *100) / 100

    return {
        totalTaxPayable,
        taxPayablePerBand,
        effectiveRate
    }
}