import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { jwtDecode } from "jwt-decode";

const API_URL = process.env.REACT_APP_BACKEND_URL

const TripsContext = createContext()

export function useTrips() {
    return useContext(TripsContext)
    }


export const TripsProvider = ({ children }) => {
    const [trips, setTrips] = useState([])

    useEffect(() => {
        getTrips()
    }, [])

    async function getTrips() {
        try {
        const token = localStorage.getItem('access_token')
        if (token !== null) {
            const response = await axios.get(`${API_URL}/trips`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
        setTrips(response.data)
        }
        } catch (error) {
        console.error('Error fetching trips:', error)
        }
    }


    async function addTrip(newTrip) {
        try {
            if (!newTrip.name || !newTrip.location || !newTrip.user_currency || !newTrip.country_currency) {
                throw new Error('Required properties missing in the new trip object')
            }
            const token = localStorage.getItem('access_token')
            const decoded = jwtDecode(token);
            const userId = decoded.user_id

            newTrip.user = userId

            const response = await axios.post(`${API_URL}/trips/`, newTrip, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json' //always add tells backend what type of data
                }
            })
            setTrips([...trips, response.data])

        } catch (error) {
            console.error('Error adding trip:', error)
        }
    }


    async function deleteTrip(tripId) {
        try {
            const token = localStorage.getItem('access_token')
        await axios.delete(`${API_URL}/trips/${tripId}/`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        } )
        setTrips(trips.filter(trip => trip.id !== tripId))

        } catch (error) {
        console.error('Error deleting trip:', error)
        }
    }

    async function editTrip(updatedTrip) {
        try {
            const token = localStorage.getItem('access_token')
            const decoded = jwtDecode(token);
            const userId = decoded.user_id
            updatedTrip.user = userId
        const response = await axios.put(`${API_URL}/trips/${updatedTrip.id}/`, updatedTrip, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        setTrips(prevTrip =>
            prevTrip.map(trip =>
            trip.id === updatedTrip.id ? response.data : trip
            )
        )
        } catch (error) {
        console.log('Error Editing Trip: ', error)
        }
    }

    return (
        <TripsContext.Provider
        value={{
            trips,
            getTrips,
            addTrip,
            deleteTrip,
            editTrip,
        }}
        >
        {children}
        </TripsContext.Provider>
    )
}
