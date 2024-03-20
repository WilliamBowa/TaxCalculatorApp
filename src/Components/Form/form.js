import { useState, useEffect } from "react";
import TaxService from "../../Service/TaxService";

const Form = ()=> {
    // useEffect(() => {
    //     TaxService()
    //   }, [])

    const dataInitialState = {
        annualIncome: "",
        taxYear: "",
    }

    var taxServiceResponse;
    const [formData, setFormData] = useState(dataInitialState);
    const [ErrorObj, setError] = useState({errorMessage: "", hasError: false,});
    const [serviceResponse, setServiceResponse] = useState({ effectiveTaxRate: "", currentTaxRate: "", totalIncomeTax: ""});

    const handleSubmit = async (e)=> {
        e.preventDefault();
        // event/form not populating on first click
        // clear form on successful submission

        // handle empty form entry before setting forn input
        if(e.target[0].value === "" || e.target[1].value === ""){
            alert("please, fill up the form");
        } 
        
        if(e.target[0].value !== "" && e.target[1].value !== "" ){
            setFormData({
                annualIncome: e.target[0].value,
                taxYear: e.target[1].value,
            })

            taxServiceResponse = await TaxService(formData.annualIncome, formData.taxYear);
          
            console.log("serviceResponse: ", taxServiceResponse.data);

            // handling error before setting api response
            if(taxServiceResponse.data){
                if(taxServiceResponse.data.hasError){
                    setError({
                        hasError: true,
                        errorMessage: taxServiceResponse.data.errorMessage
                    })
                }else {
                    setServiceResponse({
                        effectiveTaxRate: taxServiceResponse.data.effectiveTaxRate,
                        taxRate: taxServiceResponse.data.currentBandTaxRate,
                        totalIncomeTax: taxServiceResponse.data.totalIncomeTax
                    })
                }
            }
        }
    }

    return(
        <div className='formPage container' style={{background: "gray", padding: "7%"}}>
            <form onSubmit={handleSubmit} className='form'>
                <div className='row col-12'>
                    <div className='row col-12' style={{margin: "5% auto 7%"}}><strong>INCOME TAX CALCULATOR</strong></div>
                    <div className='row col-12 incomeBox'>
                        <div className='col-6' style={{textAlign: "right", marginBottom: "5%"}}>
                            <label>Annual Income:</label>
                        </div>
                        <div className='col-6'> 
                            <input type="text" name="incomeBox"/>
                        </div>
                    </div>
                    <div className='row col-12 taxYearBox'>
                        <div className='col-6' style={{textAlign: "right"}}>
                            <label>Tax Year:</label>
                        </div>
                        <div className='col-6'>
                            <input type="text" name="taxYearBox"/>
                        </div>
                    </div>
                    <div className="col-12 row">
                        { ErrorObj.hasError?
                        <div className="col-12 row" style={{color: "darkred", padding: "5% 0 0"}}>
                            <p>ERROR: {ErrorObj.errorMessage}</p>
                            <br />
                            <p>Please, try again</p>
                        </div>
                        : 
                        <div className="col-12 row">
                            <div className="col-12" style={{color: "black", marginTop: "5%"}}>
                                <strong >Total Income Tax: </strong> {serviceResponse.totalIncomeTax} 
                            </div>
                            <div className="col-12" style={{color: "black", marginTop: "2%"}}>
                                <strong >TAX RATE: </strong> {serviceResponse.taxRate} 
                            </div>
                            <div className="col-12" style={{color: "black", marginTop: "2%"}}>
                                <strong >Effective Tax Rate: </strong> {serviceResponse.effectiveTaxRate} 
                            </div>
                        </div>
                        }
                    </div>
                </div>
                <br />
                <button type="submit" style={{background: "blue", color: "white"}}>Submit</button>
            </form>
        </div>
    );
};

export default Form;
