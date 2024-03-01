import React, { useState, useEffect } from 'react'
import Freecurrencyapi from '@everapi/freecurrencyapi-js'
import './Converter.css'

const apiKey = process.env.REACT_APP_API_KEY
const freecurrencyapi = new Freecurrencyapi(apiKey)

const currencyNames = {
    EUR: 'Euro',
    USD: 'US Dollar',
    JPY: 'Japanese Yen',
    BGN: 'Bulgarian Lev',
    CZK: 'Czech Republic Koruna',
    DKK: 'Danish Krone',
    GBP: 'British Pound Sterling',
    HUF: 'Hungarian Forint',
    PLN: 'Polish Zloty',
    RON: 'Romanian Leu',
    SEK: 'Swedish Krona',
    CHF: 'Swiss Franc',
    ISK: 'Icelandic Króna',
    NOK: 'Norwegian Krone',
    HRK: 'Croatian Kuna',
    RUB: 'Russian Ruble',
    TRY: 'Turkish Lira',
    AUD: 'Australian Dollar',
    BRL: 'Brazilian Real',
    CAD: 'Canadian Dollar',
    CNY: 'Chinese Yuan',
    HKD: 'Hong Kong Dollar',
    IDR: 'Indonesian Rupiah',
    ILS: 'Israeli New Sheqel',
    INR: 'Indian Rupee',
    KRW: 'South Korean Won',
    MXN: 'Mexican Peso',
    MYR: 'Malaysian Ringgit',
    NZD: 'New Zealand Dollar',
    PHP: 'Philippine Peso',
    SGD: 'Singapore Dollar',
    THB: 'Thai Baht',
    ZAR: 'South African Rand'
};


export default function Converter() {
    const [exchangeRates, setExchangeRates] = useState(null)
    const [amountFrom, setAmountFrom] = useState()
    const [amountTo, setAmountTo] = useState()
    const [baseCurrency, setBaseCurrency] = useState('USD')
    const [targetCurrency, setTargetCurrency] = useState('EUR')



    useEffect(() => {
        freecurrencyapi.latest({
            apikey: apiKey,
            base_currency: baseCurrency,
            currencies: 'USD,EUR,NZD,AUD,GBP,JPY,BGN,CZK,DKK,HUF,PLN,RON,SEK,CHF,ISK,NOK,HRK,RUB,TRY,BRL,CAD,CNY,HKD,IDR,ILS,INR,KRW,MXN,MYR,PHP,SGD,THB,ZAR'
        }).then(response => {
            setExchangeRates(response.data)
            const currencies = Object.keys(response.data)
            if(!currencies.includes(targetCurrency)) {
                setTargetCurrency(currencies[0])
            }
        }).catch(error => {
            console.error('Error fetching exchange rates:', error)
        })
    // eslint-disable-next-line
    }, [baseCurrency])

    const handleAmountFromChange = (e) => {
        const value = parseFloat(e.target.value)
        setAmountFrom(value)
        if (exchangeRates && exchangeRates[targetCurrency]) {
            setAmountTo((value * exchangeRates[targetCurrency]).toFixed(2))
        }
    }

    const handleAmountToChange = (e) => {
        const value = parseFloat(e.target.value)
        setAmountTo(value)
        if (exchangeRates && exchangeRates[targetCurrency]) {
            setAmountFrom((value / exchangeRates[targetCurrency]).toFixed(2))
        }
    }

    const handleBaseCurrencyChange = (e) => {
        setBaseCurrency(e.target.value);
    }

    const handleTargetCurrencyChange = (e) => {
        setTargetCurrency(e.target.value)
    }
    return (
        <div className="converter-all">
            <div className="converter-container">
                <h1>Currency Converter</h1>
                <div>
                    <label>{currencyNames[baseCurrency]}:</label>
                    <input className="input" type="number" value={amountFrom} onChange={handleAmountFromChange} />
                    <select className="select" value={baseCurrency} onChange={handleBaseCurrencyChange}>
                        {exchangeRates && Object.keys(exchangeRates).map(currency => (
                            <option key={currency} value={currency}>{currency}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>{currencyNames[targetCurrency]}: </label>
                    <input className="input" type="number" value={amountTo} onChange={handleAmountToChange} />
                    <select className="select" value={targetCurrency} onChange={handleTargetCurrencyChange}>
                        {exchangeRates && Object.keys(exchangeRates).map(currency => (
                            <option key={currency} value={currency}>{currency}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}
