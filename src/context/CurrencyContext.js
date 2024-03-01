import React, { createContext, useState, useEffect } from 'react'
import Freecurrencyapi from '@everapi/freecurrencyapi-js'

const apiKey = process.env.REACT_APP_API_KEY
const freecurrencyapi = new Freecurrencyapi(apiKey)
const CurrencyContext = createContext()


export const CurrencyProvider = ({ children }) => {
    const [supportedCurrencies, setSupportedCurrencies] = useState(null)
    const [ exchangeRates, setExhangeRates ] = useState(null)

    useEffect(() => {
            const supportedCurrenciesResponse = freecurrencyapi.currencies({
                apikey: apiKey
            })
            setSupportedCurrencies(supportedCurrenciesResponse.data)

            const exchangeRatesResponse = freecurrencyapi.latest({
                apikey: apiKey,
                base_currency: 'USD',
                currencies: 'USD,EUR,JPY,BGN,CZK,DKK,GBP,HUF,PLN,RON,SEK,CHF,ISK,NOK,HRK,RUB,TRY,AUD,BRL,CAD,CNY,HKD,IDR,ILS,INR,KRW,MXN,MYR,NZD,PHP,SGD,THB,ZAR'
            })
            setExhangeRates(exchangeRatesResponse.data)
            // eslint-disable-next-line
}, [])

    return (
        <CurrencyContext.Provider value={{ supportedCurrencies, exchangeRates }}>
            {children}
        </CurrencyContext.Provider>
    )
}

export default CurrencyContext