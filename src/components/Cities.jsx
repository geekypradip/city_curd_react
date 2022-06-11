import { useState } from 'react'
import axios from 'axios'
import styles from './style.module.css'
import { useEffect } from 'react';
const Cities = () => {
    const [ renderCountry, setRenderCountry ] = useState( 1 );
    const [ renderCity, setRenderCity ] = useState( 1 );
    const [ country, setCountry ] = useState( "" );
    const [ cityDetails, setCitydetails ] = useState( {
        name: "",
        population: "",
        country:""
    } )
    const [ allCountries, setAllCountries ] = useState( [] );
    const [ allCities, setAllCities ] = useState( [] );
    /**add country Api */
    const addCountry = ( country ) => {
        const payload = {
            name:country
        }
        return axios.post( 'http://localhost:8000/countries', payload );
    }
    /**add city Api */
    const addCity = ( payload ) => {
            return axios.post( 'http://localhost:8000/cities', payload );
    }
    //**get all countries Api */
    const getAllCountry = (  ) => {
        return axios.get( 'http://localhost:8000/countries');
    }

    //**get all cities Api *//
    const getAllCities = () => {
        return axios.get( 'http://localhost:8000/cities')
    }

    //**sort api */
    const sort = ( order) => {
        return axios.get( `http://localhost:8000/cities?_sort=population&_order=${order}`)
    }

    //** delete a city api */
   const deleteCityById = (id) => {
       return axios.delete( `http://localhost:8000/cities/${id}` );
   }

    //** api end*//
//**Reset city state */
    const cityReset = () => {
        setCitydetails( {
        name: "",
        population: "",
        country:""
        })
    }
    const handleAddCountry = () => {
        if ( country )
            addCountry( country )
                .then( () => {
                    alert( "country added successfully" );
                    setRenderCountry( renderCountry + 1 );
                    setCountry( "" );
                } )
            .catch(err => {console.log( err)})
        else
            alert('country cannot be empty');
    }
    const handleAddCity = () => {
        if ( cityDetails.name && cityDetails.population && cityDetails.country ) {
            const payload = {
                name: cityDetails.name,
                population: +cityDetails.population,
                country: cityDetails.country
            }
            addCity( payload ).then( () => {
                alert( "city added successfully" );
                cityReset();
                setRenderCity( renderCity + 1 );
            } )
            .catch(err => {console.log( err)})
        }
        else {
            alert('all credentials required');
        }
    }

    //**sort  */
    const haldleSort = (value) => {
        sort( value )
            .then( (res) => {
                setAllCities(res.data)
            } )

    }
    //** delete */
    const handleDelete=(id) => {
        deleteCityById( id )
            .then( () => {
                setRenderCity( renderCity + 1 );
        })
    }
    useEffect( () => {
        getAllCountry()
            .then( ( res ) => {
                console.log( res.data );
                setAllCountries( res.data );
            } )
        .catch(err=>{console.log( err)})
    }, [ renderCountry ] )
    useEffect( () => {
        getAllCities()
            .then( ( res ) => {
                console.log( res );
                setAllCities( res.data );
            } )
            .catch( err => { console.log( err ) } );
    },[renderCity])
  return (
      <div>
          <div className={styles.formContainer}>
              <div className={styles.countryForm}>
                  <h2>Create a country</h2>
                  <input
                      type="text"
                      placeholder='Enter a country name'
                      value={ country }
                      onChange={(e)=>setCountry(e.target.value)}
                  />
                  <button
                      onClick={handleAddCountry}
                  >
                      Add country
                  </button>
              </div>
              <div className={styles.cityForm}>
              <h2>Create a city</h2>
                  <input
                      type="text"
                      placeholder='Enter a city name'
                      value={ cityDetails.name }
                      onChange={(e)=>setCitydetails({...cityDetails, name:e.target.value})}
                  />
                  <input
                      type="number"
                      placeholder="Enter a city population"
                      value={ cityDetails.population }
                      onChange={(e)=>setCitydetails({...cityDetails, population:e.target.value})}
                  />
                  <select
                      name="country"
                      id="country"
                      value={ cityDetails.country }
                      onChange={(e)=>setCitydetails({...cityDetails, country:e.target.value})}
                  >
                      <option value={""}>Choose a country</option>
                      {
                          allCountries.map( ( item ) =>
                          <option value={item.name} key={item.id}>{item.name}</option>
                          )
                      }
                  </select>
                  <button
                      onClick={handleAddCity}
                  >Add City</button>
              </div>
          </div>

          <div className={ styles.CityTableContainer }>
              <div className={ styles.CityTable }>
                <h3>City Name</h3>
                  <h3>City Population
                      <select name="sort" id="sort"  onChange={(e)=>haldleSort(e.target.value)}>
                          <option value="">sort</option>
                          <option value="desc">Hight to Low</option>
                          <option value="asc">Low to High</option>
                      </select>
                </h3>
                <h3>Country</h3>
                <h3>Action</h3>
              </div>
              {
                  allCities.map( ( item ) =>
                      <div className={ styles.CityTable } key={item.id}>
                          <div>{ item.name }</div>
                          <div>{ item.population } </div>
                          <div>{ item.country }</div>
                          <button onClick={()=>handleDelete(item.id)}>Delete</button>
                      </div>
                  )
              }
              {
                  !allCities.length && <h3>Please add a city to display</h3>
              }
              <div className={styles.pagination}>
                  <button>Prev</button>
                  <button>Next</button>
              </div>
            </div>
      </div>
  )
}

export default Cities
