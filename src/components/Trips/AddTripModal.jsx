import React, { useEffect, useRef, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { useTrips } from '../../context/TripContext'
import Freecurrencyapi from '@everapi/freecurrencyapi-js'

const freecurrencyapi = new Freecurrencyapi(process.env.REACT_APP_API_KEY)

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

export default function AddTripModal({ show, onClose }) {
  const { addTrip } = useTrips();
  const nameRef = useRef();
  const locationRef = useRef();
  const notesRef = useRef();
  const userCurrencyRef = useRef();
  const countryCurrencyRef = useRef();
  const amountSavedRef = useRef();
  const amountNeededRef = useRef();
  const [exchangeRates, setExchangeRates] = useState(null)
  const [baseCurrency, setBaseCurrency] = useState('USD')
  const [targetCurrency, setTargetCurrency] = useState('EUR')
  const [convertedAmountSaved, setConvertedAmountSaved] = useState(0)

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await freecurrencyapi.latest({
          apikey: process.env.REACT_APP_API_KEY,
          base_currency: 'USD',
          currencies: 'USD,EUR,JPY,BGN,CZK,DKK,GBP,HUF,PLN,RON,SEK,CHF,ISK,NOK,HRK,RUB,TRY,AUD,BRL,CAD,CNY,HKD,IDR,ILS,INR,KRW,MXN,MYR,NZD,PHP,SGD,THB,ZAR'
        });
        setExchangeRates(response.data)
      } catch (error) {
        console.error('Error fetching exchange rates:', error)
      }
    }
    fetchExchangeRates()
    // eslint-disable-next-line
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    const userCurrency = userCurrencyRef.current.value
    const countryCurrency = countryCurrencyRef.current.value
    const userCurrencyAmount = parseFloat(amountSavedRef.current.value)
    const exchangeRate = exchangeRates[countryCurrency]

    if (!isNaN(userCurrencyAmount) && exchangeRate) {
      const convertedAmount = (userCurrencyAmount * exchangeRate).toFixed(2)
      setConvertedAmountSaved(convertedAmount)
    } else {
      setConvertedAmountSaved(0)
    }

    try {
      await addTrip({
        name: nameRef.current.value,
        location: locationRef.current.value,
        notes: notesRef.current.value,
        user_currency: userCurrency,
        country_currency: countryCurrency,
        amount_saved: userCurrencyAmount,
        amount_needed: parseFloat(amountNeededRef.current.value)
      }) 
      onClose()
    } catch (error) {
      console.log('Error Submitting Trip:', error);
    }
  }

  const handleUserCurrencyChange = (e) => {
    setBaseCurrency(e.target.value);
  }

  const handleCountryCurrencyChange = (e) => {
    setTargetCurrency(e.target.value)
  }


  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Trip</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formName">
            <Form.Label><strong>Name *</strong></Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter trip name"
              ref={nameRef}
              required
            />
          </Form.Group>
          <Form.Group controlId="formLocation">
            <Form.Label><strong>Location *</strong></Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter location"
              ref={locationRef}
              required
            />
          </Form.Group>
          <Form.Group controlId="formNotes">
            <Form.Label><strong>Notes</strong></Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter notes"
              ref={notesRef}
            />
          </Form.Group>
          <Form.Group controlId="formUserCurrency">
            <Form.Label><strong>Your Saved Currency *</strong></Form.Label>
            <select className="form-control" ref={userCurrencyRef} onChange={handleUserCurrencyChange}>
              {exchangeRates && Object.keys(exchangeRates).map(currency => (
                <option key={currency} value={currency}>{currencyNames[currency]}</option>
              ))}
            </select>
          </Form.Group>
          <Form.Group controlId="formCountryCurrency">
            <Form.Label><strong>Visiting Country Currency *</strong></Form.Label>
            <select className="form-control" ref={countryCurrencyRef} onChange={handleCountryCurrencyChange}>
              {exchangeRates && Object.keys(exchangeRates).map(currency => (
                <option key={currency} value={currency}>{currencyNames[currency]}</option>
              ))}
            </select>
          </Form.Group>
          <Form.Group controlId="formAmountSaved">
            <Form.Label><strong>Amount Saved</strong></Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter amount saved"
              ref={amountSavedRef}
            />
          </Form.Group>
          <Form.Group controlId="formAmountNeeded">
            <Form.Label><strong>Amount Needed *</strong></Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter amount needed"
              ref={amountNeededRef}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Save Trip
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
