const { Cashify } = require('cashify')

const baseRatesAED = {
  AED: 1.00,
  SAR: 1.02,
  INR: 17.1
}

const baseRatesSAR = {
  AED: 0.98,
  SAR: 1.00,
  INR: 18.95
}

const baseRatesINR = {
  AED: 0.052,
  SAR: 0.053,
  INR: 1.00
}

const getCurrencyConvertedPrice = (baseCurrency, price, selectedCurrency) => {
  const rates = (selectedCurrency === 'AED') ? { ...baseRatesAED }
    : (selectedCurrency === 'SAR') ? { ...baseRatesSAR } : { ...baseRatesINR }

  const cashify = new Cashify({ base: selectedCurrency, rates })
  const result = cashify.convert(price, { from: baseCurrency, to: selectedCurrency })
  return Number(result).toFixed(2)
}

export default getCurrencyConvertedPrice
