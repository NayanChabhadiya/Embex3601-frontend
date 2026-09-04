import { forwardRef } from "react";
import "./pdfBill.scss";
import { formatDate, formatRupees } from "../../utils/formatters";

const PdfBill = forwardRef(({ billData, companyData, merchantData }, ref) => {
  return (
    <div ref={ref} className="pdf-only">
      <div className="single-bill-container">
        <div className="bill-container">
          <div className="bill-title">
            <div className="bill-title-left">TAX INVOICE</div>
            <div className="bill-title-center">|| SHREE GANESHAY NAMAH ||</div>
            <div className="bill-title-right">ORIGINAL / DUPLICATE</div>
          </div>
          <div className="bill-content">
            <div className="bill-header">
              {companyData?.contactDetails?.map((contactDetail) => (
                <div key={contactDetail.mobileNo} className="contact-details">
                  <div>{contactDetail.name}</div>
                  <div>MO : {contactDetail.mobileNo}</div>
                </div>
              ))}
            </div>
            <div className="company-details">
              <div className="company-name">{companyData?.name}</div>
              <div className="company-address">{companyData?.address}</div>
            </div>
            <div className="merchant-details">
              <div className="merchant-details-left">
                <div className="merchant-details-left-row">
                  <div className="merchant-details-left-title-col">
                    M/S <span>:-</span>
                  </div>
                  <div className="merchant-details-left-value-col">
                    {merchantData?.name}
                  </div>
                </div>
                <div className="merchant-details-left-row">
                  <div className="merchant-details-left-title-col">
                    ADDRESS <span>:-</span>
                  </div>
                  <div className="merchant-details-left-value-col">
                    {merchantData?.address}
                  </div>
                </div>
                <div className="merchant-details-left-row">
                  <div className="merchant-details-left-title-col">
                    GST NO <span>:-</span>
                  </div>
                  <div className="merchant-details-left-value-col">
                    {merchantData?.gstNo}
                  </div>
                </div>
              </div>
              <div className="merchant-details-right">
                <div className="merchant-details-right-top">
                  <div className="merchant-details-right-row">
                    <div className="merchant-details-right-title-col">
                      BILL NO <span>:-</span>
                    </div>
                    <div className="merchant-details-right-value-col">
                      {billData?.billNo}
                    </div>
                  </div>
                  <div className="merchant-details-right-row">
                    <div className="merchant-details-right-title-col">
                      BILL DATE <span>:-</span>
                    </div>
                    <div className="merchant-details-right-value-col">
                      {formatDate(billData?.billDate)}
                    </div>
                  </div>
                  <div className="merchant-details-right-row">
                    <div className="merchant-details-right-title-col">
                      Due DATE <span>:-</span>
                    </div>
                    <div className="merchant-details-right-value-col">
                      {formatDate(billData?.dueDate)}
                    </div>
                  </div>
                </div>
                <div className="merchant-details-right-bottom">
                  <div className="merchant-details-right-row">
                    <div className="merchant-details-right-title-col">
                      CH. NO <span>:-</span>
                    </div>
                    <div className="merchant-details-right-value-col">
                      {billData?.partyChallanNo}
                    </div>
                  </div>
                  <div className="merchant-details-right-row">
                    <div className="merchant-details-right-title-col">
                      CH. DATE <span>:-</span>
                    </div>
                    <div className="merchant-details-right-value-col">
                      {billData?.partyChallanDate
                        ? formatDate(billData?.partyChallanDate)
                        : "--"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="item-details">
              <div className="item-details-title">
                <div className="item-details-row">
                  <div className="item-sr-col">Sr No.</div>
                  <div className="item-description-col">Description</div>
                  <div className="item-hsn-col">HSN Code</div>
                  <div className="item-qty-col">Qty (Meter)</div>
                  <div
                    className="item-rate-col"
                    style={{ textAlign: "center" }}
                  >
                    Rate
                  </div>
                  <div
                    className="item-amount-col"
                    style={{ textAlign: "center" }}
                  >
                    Amount
                  </div>
                </div>
              </div>
              <div className="item-details-body">
                {billData?.items?.map((item, index) => (
                  <div className="item-details-row" key={index}>
                    <div className="item-sr-col">{index + 1}</div>
                    <div className="item-description-col">
                      {item?.description}
                    </div>
                    <div className="item-hsn-col">{item?.hsn}</div>
                    <div className="item-qty-col">{item?.meters}</div>
                    <div className="item-rate-col">
                      {formatRupees(item?.pricePerUnit)}
                    </div>
                    <div className="item-amount-col">
                      {formatRupees(item?.amount)}
                    </div>
                  </div>
                ))}
                {[...Array(50)]?.map((_, index) => (
                  <div key={`blank-${index}`} className="item-details-row">
                    <div className="item-sr-col"></div>
                    <div className="item-description-col"></div>
                    <div className="item-hsn-col"></div>
                    <div className="item-qty-col"></div>
                    <div className="item-rate-col"></div>
                    <div className="item-amount-col"></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="footer-details">
              <div className="footer-details-left">
                <div className="footer-left-row">
                  <div className="footer-gst-number">
                    <span className="gst-content">
                      GSTNO :- {companyData?.gstNo}
                    </span>
                  </div>
                  <div className="footer-udyam-number">
                    <span className="udyam-content">
                      UDYAM NO (MSME) :- {companyData?.udyamNo}
                    </span>
                  </div>
                  <div className="footer-pan-number">
                    <span className="pan-content">
                      PAN :- {companyData?.pancardNo}
                    </span>
                  </div>
                  <div className="footer-bank-details">
                    <div className="footer-bank-details-row">
                      <div className="footer-bank-details-title-col">
                        BANK NAME <span>:-</span>
                      </div>
                      <div className="footer-bank-details-value-col">
                        {companyData?.bankDetails?.bankName}
                      </div>
                    </div>
                    <div className="footer-bank-details-row">
                      <div className="footer-bank-details-title-col">
                        ACCOUNT HOLDER <span>:-</span>
                      </div>
                      <div className="footer-bank-details-value-col">
                        {companyData?.bankDetails?.accountName}
                      </div>
                    </div>
                    <div className="footer-bank-details-row">
                      <div className="footer-bank-details-title-col">
                        A/C NO <span>:-</span>
                      </div>
                      <div className="footer-bank-details-value-col">
                        {companyData?.bankDetails?.accountNumber}
                      </div>
                    </div>
                    <div className="footer-bank-details-row">
                      <div className="footer-bank-details-title-col">
                        IFSC CODE <span>:-</span>
                      </div>
                      <div className="footer-bank-details-value-col">
                        {companyData?.bankDetails?.ifscCode}
                      </div>
                    </div>
                    <div className="footer-bank-details-row">
                      <div className="footer-bank-details-title-col">
                        BRANCH NAME <span>:-</span>
                      </div>
                      <div className="footer-bank-details-value-col">
                        {companyData?.bankDetails?.branchName}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="footer-details-right">
                <table className="tax-table">
                  <tbody>
                    <tr className="tax-row">
                      <td className="tax-title-col" colSpan={2}>
                        TOTAL
                      </td>
                      <td className="tax-value-col">
                        {formatRupees(billData?.total)}
                      </td>
                    </tr>
                    <tr className="tax-row">
                      <td className="tax-title-col">DISCOUNT</td>
                      <td className="tax-rate-col">
                        {billData?.discountRate}%
                      </td>
                      <td className="tax-value-col">
                        {formatRupees(billData?.discountAmount)}
                      </td>
                    </tr>
                    <tr className="tax-row">
                      <td className="tax-title-col" colSpan={2}>
                        SUB TOTAL
                      </td>
                      <td className="tax-value-col">
                        {formatRupees(billData?.subTotal)}
                      </td>
                    </tr>
                    <tr className="tax-row">
                      <td className="tax-title-col">CGST</td>
                      <td className="tax-rate-col">{billData?.cgstRate}%</td>
                      <td className="tax-value-col">
                        {formatRupees(billData?.cgstAmount)}
                      </td>
                    </tr>
                    <tr className="tax-row">
                      <td className="tax-title-col">SGST</td>
                      <td className="tax-rate-col">{billData?.sgstRate}%</td>
                      <td className="tax-value-col">
                        {formatRupees(billData?.sgstAmount)}
                      </td>
                    </tr>
                    <tr className="tax-row">
                      <td className="tax-title-col">IGST</td>
                      <td className="tax-rate-col">{billData?.igstRate}%</td>
                      <td className="tax-value-col">
                        {formatRupees(billData?.igstAmount)}
                      </td>
                    </tr>
                    <tr className="tax-row">
                      <td className="tax-title-col" colSpan={2}>
                        TOTAL AMOUNT
                      </td>
                      <td className="tax-value-col">
                        {formatRupees(billData?.totalAmount)}
                      </td>
                    </tr>
                    <tr className="tax-row">
                      <td className="tax-title-col" colSpan={2}>
                        ROUND OFF
                      </td>
                      <td className="tax-value-col">
                        {formatRupees(billData?.roundOff)}
                      </td>
                    </tr>
                    <tr className="tax-row">
                      <td className="final-amount-title-col" colSpan={2}>
                        FINAL AMOUNT
                      </td>
                      <td className="final-amount-value-col">
                        {formatRupees(billData?.finalAmount)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="inword-section">
              <span className="inword-content">
                IN WORD :- {billData?.finalAmountInWords}
              </span>
            </div>
            <div className="tac-section">
              <div className="title">Terms & Condition</div>

              <div className="content">
                {companyData?.termsAndConditions.length > 0 ? (
                  companyData?.termsAndConditions?.map((term, index) => (
                    <div key={index}>
                      <b>{"=>"}</b> {term}
                    </div>
                  ))
                ) : (
                  <div>No Terms and Conditions Available</div>
                )}
              </div>
            </div>
            <div className="signature-section">
              <div className="signature-section-row">
                <div className="signature-section-col">
                  <div className="signature-section-title">
                    RECEIVER'S SIGNATURE
                  </div>
                </div>
                <div className="signature-section-col">
                  <div className="signature-section-title">
                    FOR {companyData?.name}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default PdfBill;
