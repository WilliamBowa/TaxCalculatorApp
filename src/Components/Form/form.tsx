import { useState } from "react";
import TaxService from "../../Service/TaxService";
import { getOwnedTax } from "../../Helper/getOwnedTax";

const Form = ()=> {
    const userInputsEntry = {
        annualIncome: 0,
        taxYear: 0,
    }

    const [formData, setFormData] = useState(userInputsEntry);
    const [ErrorObj, setError] = useState({errorMessage: "", hasError: false,});
    const [serviceResponse, setServiceResponse] = useState({ totalTaxPayable: 0, effectiveTaxRate: 0, taxOwnperBand: []});
    
    const handleSubmit = async (e: any)=> {
        e.preventDefault();

        if(e.target[0].value !== "" && e.target[1].value !== "" ){
            setFormData({
                annualIncome: e.target[0].value.trim(),
                taxYear: e.target[1].value.trim()
            })

            if(formData.annualIncome && formData.taxYear){
                var taxServiceResponse = await TaxService(formData.annualIncome, formData.taxYear);

                console.log({taxServiceResponse})
                
                // handling error before setting api response
                if(taxServiceResponse){
                    if(taxServiceResponse.errors.hasError){
                        setError({
                            hasError: true,
                            errorMessage: taxServiceResponse.errors.errorMessage
                        })
                    }else {

                        var taxOwned = getOwnedTax(formData, taxServiceResponse);

                        setServiceResponse({
                            totalTaxPayable: taxOwned?.totalTaxPayable,
                            effectiveTaxRate: taxOwned?.effectiveRate,
                            taxOwnperBand: taxOwned?.taxPayablePerBand
                        })
                    }
                }
            }
        }
    }

    const clearForm = (e: any) => {
        e.target.form[0].value = "";
        e.target.form[1].value = "";

        setFormData({
            annualIncome: 0,
            taxYear: 0
        })

        setServiceResponse({
            effectiveTaxRate: 0,
            totalTaxPayable: 0,
            taxOwnperBand: []
        });

        setError({
            hasError: false,
            errorMessage: ""
        })
    }

    return(
        <div className='formPage container' style={{background: "gray", padding: "7%"}}>
            <form onSubmit={(e) => handleSubmit(e)} className='form'>
                <div className='row col-12'>
                    <div className='row col-12' style={{margin: "5% auto 7%"}}><strong>INCOME TAX CALCULATOR</strong></div>
                    <div className='row col-12 incomeBox'>
                        <div className='col-6' style={{textAlign: "right", marginBottom: "5%"}}>
                            <label htmlFor="annualIncome">Annual Income:</label>
                        </div>
                        <div className='col-6'> 
                            <input required type="text" name="incomeBox"/>
                        </div>
                    </div>
                    <div className='row col-12 taxYearBox'>
                        <div className='col-6' style={{textAlign: "right"}}>
                            <label htmlFor="taxYear">Tax Year:</label>
                        </div>
                        <div className='col-6'>
                            <input required type="text" name="taxYearBox"/>
                        </div>
                    </div>
                    <div className="col-12 row">
                        { ErrorObj.hasError?
                        <div className="col-12 row" style={{color: "darkred", padding: "5% 0 0"}}>
                            <p>ERROR: {ErrorObj.errorMessage}</p>
                            <p>Please, try again</p>
                        </div>
                        : 
                        <div className="col-12 row">
                            <div className="col-12" style={{color: "black", marginTop: "5%"}}>
                                <strong >Total Tax Payable: </strong> {serviceResponse.totalTaxPayable} 
                            </div>
                            <div className="col-12" style={{color: "black", marginTop: "2%"}}>
                                <strong >Effective Tax Rate: </strong> 
                                {serviceResponse.effectiveTaxRate? (serviceResponse.effectiveTaxRate * 100) + "%" : ""} 
                            </div>
                            <div className="col-12" style={{color: "black", marginTop: "2%"}}>
                                <strong >Tax Own Per Band: </strong> 
                                {
                                    serviceResponse.taxOwnperBand.map( (taxOwn: any) => {
                                        return taxOwn + " | " 
                                    })
                                } 
                            </div>
                        </div>
                        }
                    </div>
                </div>
                <br />
                <button type="submit" id="submitForm" style={{background: "blue", color: "white"}}>Submit</button>
                <input type="button" name="clearForm" style={{marginLeft: "2%"}} value="Clear" onClick={clearForm} />
            </form>
        </div>
    );
};

export default Form;
