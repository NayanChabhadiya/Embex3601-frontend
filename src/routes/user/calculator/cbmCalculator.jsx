import React, { useState } from "react";
import "./cbmCalculator.scss";

const unitConversion = {
  mm: 1000000000,
  cm: 1000000,
  inch: 61023.7,
  feet: 28316.8,
  yard: 764555,
  meter: 1,
};

const CBM_TO_CBFT = 35.3147;

const CbmCalculator = () => {
  const [form, setForm] = useState({
    length: "",
    width: "",
    height: "",
    unit: "cm",
    weight: "",
    weightUnit: "kg",
    quantity: 1,
    pricePerUnit: "",
    currency: "USD",
  });

  const handleFormChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const calculateValues = () => {
    const l = parseFloat(form.length) || 0;
    const w = parseFloat(form.width) || 0;
    const h = parseFloat(form.height) || 0;
    const qty = parseInt(form.quantity) || 1;
    const unit = form.unit;

    const volumePerCartonM3 = (l * w * h) / unitConversion[unit];
    const volumeM3 = volumePerCartonM3 * qty;
    const volumeFt3 = volumeM3 * CBM_TO_CBFT;

    const grossWeightKg =
      form.weightUnit === "kg"
        ? parseFloat(form.weight) || 0
        : (parseFloat(form.weight) || 0) * 0.453592;

    const grossWeightLb =
      form.weightUnit === "lb"
        ? parseFloat(form.weight) || 0
        : (parseFloat(form.weight) || 0) * 2.20462;

    const volWeightSeaKg = volumeM3 * 1000;
    const volWeightSeaLb = volWeightSeaKg * 2.20462;

    const volWeightAirKg = volumeM3 * 167;
    const volWeightAirLb = volWeightAirKg * 2.20462;

    const container20 = volumeM3 / 28;
    const container40 = volumeM3 / 56;
    const container40HC = volumeM3 / 68;

    const cartonsIn20 =
      volumePerCartonM3 > 0 ? Math.floor(28 / volumePerCartonM3) : 0;
    const cartonsIn40 =
      volumePerCartonM3 > 0 ? Math.floor(56 / volumePerCartonM3) : 0;
    const cartonsIn40HC =
      volumePerCartonM3 > 0 ? Math.floor(68 / volumePerCartonM3) : 0;

    const pricePerUnit = parseFloat(form.pricePerUnit) || 0;
    const totalPrice = pricePerUnit * qty;
    const pricePerCbm = volumeM3 > 0 ? totalPrice / volumeM3 : 0;
    const pricePerContainer20 = cartonsIn20 * pricePerUnit;
    const pricePerContainer40 = cartonsIn40 * pricePerUnit;
    const pricePerContainer40HC = cartonsIn40HC * pricePerUnit;

    return {
      volumeM3,
      volumeFt3,
      grossWeightKg,
      grossWeightLb,
      volWeightSeaKg,
      volWeightSeaLb,
      volWeightAirKg,
      volWeightAirLb,
      container20,
      container40,
      container40HC,
      cartonsIn20,
      cartonsIn40,
      cartonsIn40HC,
      totalPrice,
      pricePerCbm,
      pricePerContainer20,
      pricePerContainer40,
      pricePerContainer40HC,
    };
  };

  const result = calculateValues();

  return (
    <div className="cbm-calculator">
      <h2 className="headerdiv">CBM Calculator</h2>

      <div className="maindiv">
        <div className="divleft">Unit of Measurement</div>
        <div className="divright">
          <select
            className="selectdim"
            value={form.unit}
            onChange={(e) => handleFormChange("unit", e.target.value)}
          >
            <option value="cm">cm</option>
            <option value="mm">mm</option>
            <option value="meter">meter</option>
            <option value="inch">inch</option>
            <option value="feet">feet</option>
            <option value="yard">yard</option>
          </select>
        </div>
      </div>

      {["length", "width", "height"]?.map((dim) => (
        <div className="maindiv" key={dim}>
          <div className="divleft">
            {dim.charAt(0).toUpperCase() + dim.slice(1)}
          </div>
          <div className="divright">
            <input
              type="number"
              className="divinputnormal"
              value={form[dim]}
              onChange={(e) => handleFormChange(dim, e.target.value)}
            />
          </div>
        </div>
      ))}

      <div className="maindiv">
        <div className="divleft">Gross Weight</div>
        <div className="divright">
          <div className="divrightsmaller">
            <div className="divrightinnerleft">
              <input
                type="number"
                className="divinputsmall"
                value={form.weight}
                onChange={(e) => handleFormChange("weight", e.target.value)}
              />
            </div>
            <div className="divrightinnerright">
              <select
                className="selectwt"
                value={form.weightUnit}
                onChange={(e) =>
                  handleFormChange("weightUnit", e.target.value)
                }
              >
                <option value="kg">kg</option>
                <option value="lb">lb</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="maindiv">
        <div className="divleft">Quantity</div>
        <div className="divright">
          <input
            type="number"
            className="divinputnormal"
            value={form.quantity}
            onChange={(e) => handleFormChange("quantity", e.target.value)}
          />
        </div>
      </div>

      <div className="maindiv">
        <div className="divleft">Price Per Unit</div>
        <div className="divright">
          <div className="divrightsmaller">
            <div className="divrightinnerleft">
              <input
                type="number"
                className="divinputsmall"
                value={form.pricePerUnit}
                onChange={(e) =>
                  handleFormChange("pricePerUnit", e.target.value)
                }
              />
            </div>
            <div className="divrightinnerright">
              <select
                className="selectwt"
                value={form.currency}
                onChange={(e) => handleFormChange("currency", e.target.value)}
              >
                <option value="USD">USD</option>
                <option value="INR">INR</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="mainvolumediv">
        <div className="divvolume">
          <div className="divvolumeleft">Volume Cubic Meter (m³)</div>
          <div className="divvolumeright">Volume Cubic Feet (ft³)</div>
        </div>
        <div className="divvolume">
          <div className="divvolumeleft">
            <input type="text" value={result.volumeM3.toFixed(4)} readOnly />
          </div>
          <div className="divvolumeright">
            <input type="text" value={result.volumeFt3.toFixed(4)} readOnly />
          </div>
        </div>
      </div>

      <div className="maindiv">
        <div className="divleft">Weight (kg)</div>
        <div className="divright">
          <input
            type="text"
            className="divinputnormal"
            value={result.grossWeightKg.toFixed(2)}
            readOnly
          />
        </div>
      </div>

      <div className="maindiv">
        <div className="divleft">Weight (lb)</div>
        <div className="divright">
          <input
            type="text"
            className="divinputnormal"
            value={result.grossWeightLb.toFixed(2)}
            readOnly
          />
        </div>
      </div>

      <div className="maindiv">
        <div className="divleft">Volumetric Weight Sea</div>
        <div className="divright">
          <div className="divwtwrapper">
            <div className="divrightWtinnerleft">
              <input
                type="text"
                className="divinputsmaller"
                value={result.volWeightSeaKg.toFixed(2)}
                readOnly
              />
              <div className="divrightinnerText">kg</div>
            </div>
            <div className="divrightWtinnerright">
              <input
                type="text"
                className="divinputsmaller"
                value={result.volWeightSeaLb.toFixed(2)}
                readOnly
              />
              <div className="divrightinnerText">lb</div>
            </div>
          </div>
        </div>
      </div>

      <div className="maindiv">
        <div className="divleft">Volumetric Weight Air</div>
        <div className="divright">
          <div className="divwtwrapper">
            <div className="divrightWtinnerleft">
              <input
                type="text"
                className="divinputsmaller"
                value={result.volWeightAirKg.toFixed(2)}
                readOnly
              />
              <div className="divrightinnerText">kg</div>
            </div>
            <div className="divrightWtinnerright">
              <input
                type="text"
                className="divinputsmaller"
                value={result.volWeightAirLb.toFixed(2)}
                readOnly
              />
              <div className="divrightinnerText">lb</div>
            </div>
          </div>
        </div>
      </div>

      {["20", "40", "40HC"]?.map((size) => (
        <div className="maindiv" key={size}>
          <div className="divleft">{size} FT Container</div>
          <div className="divright">
            <input
              type="text"
              className="divinputnormal"
              value={result[`container${size}`]?.toFixed(2) || "0.00"}
              readOnly
            />
            <div className="divrightinnerText">
              {result[`cartonsIn${size}`]} cartons fit
            </div>
          </div>
        </div>
      ))}

      <div className="maindiv">
        <div className="divleft">Total Price</div>
        <div className="divright">
          <input
            type="text"
            className="divinputnormal"
            value={`${form.currency} ${result.totalPrice.toFixed(2)}`}
            readOnly
          />
        </div>
      </div>

      <div className="maindiv">
        <div className="divleft">Price per CBM</div>
        <div className="divright">
          <input
            type="text"
            className="divinputnormal"
            value={`${form.currency} ${result.pricePerCbm.toFixed(2)}`}
            readOnly
          />
        </div>
      </div>

      {["20", "40", "40HC"]?.map((size) => (
        <div className="maindiv" key={`price${size}`}>
          <div className="divleft">Price for {size}FT Container</div>
          <div className="divright">
            <input
              type="text"
              className="divinputnormal"
              value={`${form.currency} ${result[`pricePerContainer${size}`]?.toFixed(2) || "0.00"}`}
              readOnly
            />
          </div>
        </div>
      ))}

      <div className="footerdiv"></div>
    </div>
  );
};

export default CbmCalculator;
