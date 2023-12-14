import { useState, useEffect } from 'react'

import './App.css'

function App() {
  const [exchanges, setExchanges] = useState([])
  const [exchangesArray, setExchangesArray] = useState()
  const [currency, setCurrency] = useState([{ rate: { buy: 0, sell: 0 } }]);
  const [value, setValue] = useState(0)
  const [convertedValue, setConvertedValue] = useState(0)

  useEffect(() => {
    document.title = `UruCambio - UYU a ${currency[0].currency}`
  }, [ currency ])
  
  useEffect(() => {
    fetch('https://cotizaciones-brou-v2-e449.fly.dev/currency/latest')
      .then(response => response.json())
      .then(data => setExchanges(data.rates))
      .catch(error => console.error(error))
    
  }, [])
  useEffect(() => {
    const array = Object.keys(exchanges).map(key => {
      return {
        currency: key,
        rate: exchanges[key]
      }
    })
    setExchangesArray(array)
    setCurrency(
      array.filter((exchange) => {
        if (exchange.currency === "USD") {
          return exchange;
        }
      })
    );
  }, [exchanges])

  const handleChange = (e) => {
    
    setCurrency(exchangesArray.filter((exchange) => {
      if (exchange.currency === e.target.value) {
        return exchange
      }
    }))
  }






  const handleExchange = (e) => {
    setValue(e.target.value)
    currency &&
      setConvertedValue(
        e.target.value / ((currency[0].rate.buy + currency[0].rate.sell) / 2)
      );
  }

  const handleExchangeInvert = (e) => {
    setConvertedValue(e.target.value);
    currency &&
      setValue(
        e.target.value * ((currency[0].rate.buy + currency[0].rate.sell) / 2)
      );
  }

  return (
    <>
      <header>
          <h1>UruCambio</h1>
        <h3>Cotizaciones</h3>
          
        </header>
      <div className="App">


        <section>
        <div className='container'>
          <form>
          UYU
            <label>
              
              <input value={ value } onChange={(e) => handleExchange(e)} type="number" />
            </label>
            
            <label>
           
              <select onChange={(e) => handleChange(e)}>
                {exchangesArray && exchangesArray.map(exchange => (
                  <option key={exchange.currency} value={exchange.currency}>
                    {exchange.currency}
                  </option>
                ))}
              </select>

            </label>
            <label>
          
              <input value={ convertedValue } onChange={(e) => handleExchangeInvert(e)} type="number" />
            </label>
          </form>
        </div>
        </section>
        <section>
        <div className='exchanges'>
          <table>

            <thead>
              <tr>
                <th>Moneda</th>
                <th>Cambio</th>
              </tr>
            </thead>
            <tbody>
              {exchangesArray && exchangesArray.map(exchange => (
                <tr key={exchange.currency}>
                  <td>{exchange.currency}</td>
                  <td>{((exchange.rate.buy + exchange.rate.sell ) / 2).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            
          </table>
         
</div>
</section>
      </div>
    </>
  )
}

export default App
