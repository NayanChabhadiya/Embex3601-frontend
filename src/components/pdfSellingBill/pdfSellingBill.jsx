import React, { forwardRef, useEffect } from "react";
import "./pdfSellingBill.scss";
import { formatDate, formatRupees } from "../../utils/formatters";
import { useDispatch, useSelector } from "react-redux";
import { getItemsByUser } from "../../store/apiSlice/itemSlice";

const PdfSellingBill = forwardRef(
  ({ sellingData, companyData, buyerData }, ref) => {
    const dispatch = useDispatch();
    const loggedInUserId = JSON.parse(localStorage.getItem("authUser"))?._id;

    useEffect(() => {
      dispatch(getItemsByUser(loggedInUserId));
    }, [dispatch]);

    const { items } = useSelector((state) => state.items);
    return (
      <>
        <div ref={ref} className="pdf-only">
          <div className="selling-bill-container">
            <div className="original-bill-container">
              <div className="bill-title">
                <div className="bill-title-left">TAX INVOICE</div>
                <div className="bill-title-center">
                  || SHREE GANESHAY NAMAH ||
                </div>
                <div className="bill-title-right">ORIGINAL</div>
              </div>
              <div className="bill-content">
                <div className="bill-header">
                  {companyData?.contactDetails?.map((contactDetail) => (
                    <div
                      key={contactDetail.mobileNo}
                      className="contact-details"
                    >
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
                        {buyerData?.name}{" "}
                        {buyerData?.reference
                          ? `(REF. ${buyerData?.reference})`
                          : ""}
                      </div>
                    </div>
                    <div className="merchant-details-left-row">
                      <div className="merchant-details-left-title-col">
                        ADDRESS <span>:-</span>
                      </div>
                      <div className="merchant-details-left-value-col">
                        {buyerData?.address}
                      </div>
                    </div>
                    <div className="merchant-details-left-row">
                      <div className="merchant-details-left-title-col">
                        GST NO <span>:-</span>
                      </div>
                      <div className="merchant-details-left-value-col">
                        {buyerData?.gstNo}
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
                          {sellingData?.billNo}
                        </div>
                      </div>
                      <div className="merchant-details-right-row">
                        <div className="merchant-details-right-title-col">
                          BILL DATE <span>:-</span>
                        </div>
                        <div className="merchant-details-right-value-col">
                          {formatDate(sellingData?.billDate)}
                        </div>
                      </div>
                      <div className="merchant-details-right-row">
                        <div className="merchant-details-right-title-col">
                          Due DATE <span>:-</span>
                        </div>
                        <div className="merchant-details-right-value-col">
                          {formatDate(sellingData?.dueDate)}
                        </div>
                      </div>
                    </div>
                    <div className="merchant-details-right-bottom">
                      <div className="merchant-details-right-row">
                        <div className="merchant-details-right-title-col">
                          CH. NO <span>:-</span>
                        </div>
                        <div className="merchant-details-right-value-col">
                          {sellingData?.partyChallanNo}
                        </div>
                      </div>
                      <div className="merchant-details-right-row">
                        <div className="merchant-details-right-title-col">
                          CH. DATE <span>:-</span>
                        </div>
                        <div className="merchant-details-right-value-col">
                          {sellingData?.partyChallanDate
                            ? formatDate(sellingData?.partyChallanDate)
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
                      <div className="item-itemName-col">Item Name</div>
                      <div className="item-unitType-col">Unit Type</div>
                      <div className="item-hsn-col">HSN Code</div>
                      <div className="item-qty-col">Qty</div>
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
                    {sellingData?.items?.map((item, index) => {
                      const singleItem =
                        items?.find((i) => i._id === item?.item)?.name || "N/A";
                      return (
                        <div className="item-details-row" key={index}>
                          <div className="item-sr-col">{index + 1}</div>
                          <div className="item-itemName-col">{singleItem}</div>
                          <div className="item-unitType-col">
                            {item?.unitType || "N/A"}
                          </div>
                          <div className="item-hsn-col">{item?.hsn}</div>
                          <div className="item-qty-col">{item?.qty}</div>
                          <div className="item-rate-col">
                            {formatRupees(item?.pricePerUnit)}
                          </div>
                          <div className="item-amount-col">
                            {formatRupees(item?.amount)}
                          </div>
                        </div>
                      );
                    })}
                    {[...Array(50)]?.map((_, index) => (
                      <div key={`blank-${index}`} className="item-details-row">
                        <div className="item-sr-col"></div>
                        <div className="item-itemName-col"></div>
                        <div className="item-unitType-col"></div>
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
                            {formatRupees(sellingData?.total)}
                          </td>
                        </tr>
                        <tr className="tax-row">
                          <td className="tax-title-col">DISCOUNT</td>
                          <td className="tax-rate-col">
                            {sellingData?.discountRate}%
                          </td>
                          <td className="tax-value-col">
                            {formatRupees(sellingData?.discountAmount)}
                          </td>
                        </tr>
                        <tr className="tax-row">
                          <td className="tax-title-col" colSpan={2}>
                            SUB TOTAL
                          </td>
                          <td className="tax-value-col">
                            {formatRupees(sellingData?.subTotal)}
                          </td>
                        </tr>
                        <tr className="tax-row">
                          <td className="tax-title-col">CGST</td>
                          <td className="tax-rate-col">
                            {sellingData?.cgstRate}%
                          </td>
                          <td className="tax-value-col">
                            {formatRupees(sellingData?.cgstAmount)}
                          </td>
                        </tr>
                        <tr className="tax-row">
                          <td className="tax-title-col">SGST</td>
                          <td className="tax-rate-col">
                            {sellingData?.sgstRate}%
                          </td>
                          <td className="tax-value-col">
                            {formatRupees(sellingData?.sgstAmount)}
                          </td>
                        </tr>
                        <tr className="tax-row">
                          <td className="tax-title-col">IGST</td>
                          <td className="tax-rate-col">
                            {sellingData?.igstRate}%
                          </td>
                          <td className="tax-value-col">
                            {formatRupees(sellingData?.igstAmount)}
                          </td>
                        </tr>
                        <tr className="tax-row">
                          <td className="tax-title-col" colSpan={2}>
                            TOTAL AMOUNT
                          </td>
                          <td className="tax-value-col">
                            {formatRupees(sellingData?.totalAmount)}
                          </td>
                        </tr>
                        <tr className="tax-row">
                          <td className="tax-title-col" colSpan={2}>
                            ROUND OFF
                          </td>
                          <td className="tax-value-col">
                            {formatRupees(sellingData?.roundOff)}
                          </td>
                        </tr>
                        <tr className="tax-row">
                          <td className="final-amount-title-col" colSpan={2}>
                            FINAL AMOUNT
                          </td>
                          <td className="final-amount-value-col">
                            {formatRupees(sellingData?.finalAmount)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="inword-section">
                  <span className="inword-content">
                    IN WORD :- {sellingData?.finalAmountInWords}
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
            <div className="duplicate-bill-container">
              <div className="bill-title">
                <div className="bill-title-left">TAX INVOICE</div>
                <div className="bill-title-center">
                  || SHREE GANESHAY NAMAH ||
                </div>
                <div className="bill-title-right">DUPLICATE</div>
              </div>
              <div className="bill-content">
                <div className="bill-header">
                  {companyData?.contactDetails?.map((contactDetail) => (
                    <div
                      key={contactDetail.mobileNo}
                      className="contact-details"
                    >
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
                        {buyerData?.name}{" "}
                        {buyerData?.reference
                          ? `(REF. ${buyerData?.reference})`
                          : ""}
                      </div>
                    </div>
                    <div className="merchant-details-left-row">
                      <div className="merchant-details-left-title-col">
                        ADDRESS <span>:-</span>
                      </div>
                      <div className="merchant-details-left-value-col">
                        {buyerData?.address}
                      </div>
                    </div>
                    <div className="merchant-details-left-row">
                      <div className="merchant-details-left-title-col">
                        GST NO <span>:-</span>
                      </div>
                      <div className="merchant-details-left-value-col">
                        {buyerData?.gstNo}
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
                          {sellingData?.billNo}
                        </div>
                      </div>
                      <div className="merchant-details-right-row">
                        <div className="merchant-details-right-title-col">
                          BILL DATE <span>:-</span>
                        </div>
                        <div className="merchant-details-right-value-col">
                          {formatDate(sellingData?.billDate)}
                        </div>
                      </div>
                      <div className="merchant-details-right-row">
                        <div className="merchant-details-right-title-col">
                          Due DATE <span>:-</span>
                        </div>
                        <div className="merchant-details-right-value-col">
                          {formatDate(sellingData?.dueDate)}
                        </div>
                      </div>
                    </div>
                    <div className="merchant-details-right-bottom">
                      <div className="merchant-details-right-row">
                        <div className="merchant-details-right-title-col">
                          CH. NO <span>:-</span>
                        </div>
                        <div className="merchant-details-right-value-col">
                          {sellingData?.partyChallanNo}
                        </div>
                      </div>
                      <div className="merchant-details-right-row">
                        <div className="merchant-details-right-title-col">
                          CH. DATE <span>:-</span>
                        </div>
                        <div className="merchant-details-right-value-col">
                          {sellingData?.partyChallanDate
                            ? formatDate(sellingData?.partyChallanDate)
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
                      <div className="item-itemName-col">Item Name</div>
                      <div className="item-unitType-col">Unit Type</div>
                      <div className="item-hsn-col">HSN Code</div>
                      <div className="item-qty-col">Qty</div>
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
                    {sellingData?.items?.map((item, index) => {
                      const singleItem =
                        items?.find((i) => i._id === item?.item)?.name || "N/A";
                      return (
                        <div className="item-details-row" key={index}>
                          <div className="item-sr-col">{index + 1}</div>
                          <div className="item-itemName-col">{singleItem}</div>
                          <div className="item-unitType-col">
                            {item?.unitType || "N/A"}
                          </div>
                          <div className="item-hsn-col">{item?.hsn}</div>
                          <div className="item-qty-col">{item?.qty}</div>
                          <div className="item-rate-col">
                            {formatRupees(item?.pricePerUnit)}
                          </div>
                          <div className="item-amount-col">
                            {formatRupees(item?.amount)}
                          </div>
                        </div>
                      );
                    })}
                    {[...Array(50)]?.map((_, index) => (
                      <div key={`blank-${index}`} className="item-details-row">
                        <div className="item-sr-col"></div>
                        <div className="item-itemName-col"></div>
                        <div className="item-unitType-col"></div>
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
                            {formatRupees(sellingData?.total)}
                          </td>
                        </tr>
                        <tr className="tax-row">
                          <td className="tax-title-col">DISCOUNT</td>
                          <td className="tax-rate-col">
                            {sellingData?.discountRate}%
                          </td>
                          <td className="tax-value-col">
                            {formatRupees(sellingData?.discountAmount)}
                          </td>
                        </tr>
                        <tr className="tax-row">
                          <td className="tax-title-col" colSpan={2}>
                            SUB TOTAL
                          </td>
                          <td className="tax-value-col">
                            {formatRupees(sellingData?.subTotal)}
                          </td>
                        </tr>
                        <tr className="tax-row">
                          <td className="tax-title-col">CGST</td>
                          <td className="tax-rate-col">
                            {sellingData?.cgstRate}%
                          </td>
                          <td className="tax-value-col">
                            {formatRupees(sellingData?.cgstAmount)}
                          </td>
                        </tr>
                        <tr className="tax-row">
                          <td className="tax-title-col">SGST</td>
                          <td className="tax-rate-col">
                            {sellingData?.sgstRate}%
                          </td>
                          <td className="tax-value-col">
                            {formatRupees(sellingData?.sgstAmount)}
                          </td>
                        </tr>
                        <tr className="tax-row">
                          <td className="tax-title-col">IGST</td>
                          <td className="tax-rate-col">
                            {sellingData?.igstRate}%
                          </td>
                          <td className="tax-value-col">
                            {formatRupees(sellingData?.igstAmount)}
                          </td>
                        </tr>
                        <tr className="tax-row">
                          <td className="tax-title-col" colSpan={2}>
                            TOTAL AMOUNT
                          </td>
                          <td className="tax-value-col">
                            {formatRupees(sellingData?.totalAmount)}
                          </td>
                        </tr>
                        <tr className="tax-row">
                          <td className="tax-title-col" colSpan={2}>
                            ROUND OFF
                          </td>
                          <td className="tax-value-col">
                            {formatRupees(sellingData?.roundOff)}
                          </td>
                        </tr>
                        <tr className="tax-row">
                          <td className="final-amount-title-col" colSpan={2}>
                            FINAL AMOUNT
                          </td>
                          <td className="final-amount-value-col">
                            {formatRupees(sellingData?.finalAmount)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="inword-section">
                  <span className="inword-content">
                    IN WORD :- {sellingData?.finalAmountInWords}
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
      </>
    );
  }
);

export default PdfSellingBill;
