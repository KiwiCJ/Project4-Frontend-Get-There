
import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useTrips } from '../../context/TripContext'
import EditTripModal from './EditTripModal'
import './SingleTrip.css'
import ProgressBar from 'progressbar.js'
import Freecurrencyapi from '@everapi/freecurrencyapi-js'

const freecurrencyapi = new Freecurrencyapi(process.env.REACT_APP_API_KEY)

const SingleTrip = () => {
    const { id } = useParams();
    const { trips } = useTrips();
    const [loading, setLoading] = useState(true);
    const [trip, setTrip] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false)
    const progressBarRef = useRef(null)
    const [exchangeRates, setExchangeRates] = useState(null)

    useEffect(() => {
        if (trips) {
            const foundTrip = trips.find(trip => trip.id === parseInt(id))
            setTrip(foundTrip)
            setLoading(false)
        }
        // eslint-disable-next-line
    }, [trips, id]);

    useEffect(() =>{
        if (trip && !progressBarRef.current) {
            const progressPercentage = (trip.amount_saved / trip.amount_needed) * 100
            
            let color
            if(progressPercentage < 30) {
                color = '#FF6347'
            } else if (progressPercentage < 60) {
                color = '#FFA500'
            } else {
                color = '#00FF00'
            }

            progressBarRef.current = new ProgressBar.Circle('#progress-container', {
                strokeWidth: 10,
                color: color,
                trailColor: '#f3f3f3',
                trailWidth: 10,
                duration: 2000,
                easing: 'easeInOut'
            })
            progressBarRef.current.animate(progressPercentage / 100)
        }
        // eslint-disable-next-line
    }, [trip])

    useEffect(() => {
        if (trip && progressBarRef.current) {
            const progressPercentage = (convertedAmountSaved / trip.amount_needed) * 100

            let color
            if(progressPercentage < 30) {
                color = '#FF6347'
            } else if (progressPercentage < 60) {
                color = '#FFA500'
            } else {
                color = '#00FF00'
            }
            
            progressBarRef.current.set(progressPercentage / 100)
            progressBarRef.current.path.setAttribute('stroke', color)
        }
        // eslint-disable-next-line
    }, [trip])

    useEffect(() => {
        if (trip) {
            const fetchExchangeRates = async () => {
                try {
                    const response = await freecurrencyapi.latest({
                        apikey: process.env.REACT_APP_API_KEY,
                        base_currency: trip.user_currency,
                        currencies: trip.country_currency
                    });
                    setExchangeRates(response.data)
                } catch (error) {
                    console.error('Error fetching exchange rates:', error)
                }
            }
            fetchExchangeRates();
        }
        // eslint-disable-next-line
    }, [trip]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!trip) {
        return <div>Trip not found</div>;
    }

    const openEditModal = () => {
        setShowEditModal(true)
    }

    const closeEditModal = () => {
        setShowEditModal(false)
    }

    const convertedAmountSaved = exchangeRates ? (trip.amount_saved * exchangeRates[trip.country_currency]).toFixed(2) : 'N/A'
    if (exchangeRates) {
        const convertedAmountSaved = (trip.amount_saved * exchangeRates[trip.country_currency]).toFixed(2)
        const progressPercentage = (convertedAmountSaved / trip.amount_needed) * 100

        let color;
        if (progressPercentage < 30) {
            color = '#FF6347'
        } else if (progressPercentage < 60) {
            color = '#FFA500'
        } else {
            color = '#00FF00'
        }

        if (progressBarRef.current) {
            progressBarRef.current.set(progressPercentage / 100)
            progressBarRef.current.path.setAttribute('stroke', color)
        }
    }
    
    return (
        <div className="container mt-5">
        <div className="card">
            <div className="card-header">
                <h1 className="card-title">{trip.name}</h1>
            </div>
            <div className="card-body">
                <p><strong>Location:</strong><br/><span className='trip-text'>{trip.location}</span></p>
                <p><strong>Notes:</strong><br/><span className='trip-text'>{trip.notes}</span></p>
                <p><strong>Your Saved Currency:</strong><br/><span className='trip-text'>{trip.user_currency}</span></p>
                <p><strong>Visiting Country Currency:</strong><br/><span className='trip-text'>{trip.country_currency}</span></p>
                <p><strong>Amount Saved:</strong><br/><span className='trip-text'>{trip.user_currency}: {trip.amount_saved}</span></p>
                <p><strong>Amount Needed:</strong><br/><span className='trip-text'>{trip.country_currency}: {trip.amount_needed}</span></p>
                <p><strong>Converted Amount Saved:</strong><br/><span className='trip-text'>{trip.country_currency}: {convertedAmountSaved}</span></p>
                <div id='progress-container'>
                    <span className='progress-label'>{Math.round((convertedAmountSaved / trip.amount_needed) * 100)}%</span>
                </div>
                <button className='btn btn-primary' onClick={openEditModal}>Edit Trip</button>
            </div>
        </div>
        <EditTripModal trip={trip} show={showEditModal} onClose={closeEditModal} />
    </div>
    );
};

export default SingleTrip;
