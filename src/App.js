import { useEffect, useState } from 'react';
import './App.css';

function App() {
  // React Hooks for receiving data and posting it to MongoDB
  const [name, setName] = useState('');
  const [datetime, setDatetime] = useState('');
  const [description, setDescription] = useState('');
  const [transactions, setTransactions] = useState([]);
  
  // Run this function once to get data and post it to MongoDB
  useEffect(() => {
    getTransactions().then(setTransactions);
  }, []);

  // Get transaction information and parse it into json format
  async function getTransactions() {
    const url = process.env.REACT_APP_API_URL+'/transactions';
    const response = await fetch(url);
    return await response.json(); 
  }

  // Add a new transaction to MongoDB
  function addNewTransaction(ev) {
    ev.preventDefault();
    const url = process.env.REACT_APP_API_URL+'/transaction';
    
    const price = name.split(" ")[0];
    // Post transaction onto MongoDB
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        price,
        name: name.substring(price.length + 1),
        description,
        datetime,
      }),
      // Upon completion set values to empty string
    }).then((response) => {
      response.json().then((json) => {
        setName("");
        setDatetime("");
        setDescription("");
        console.log("result", json);
      });
    });
   

  }

  // Calculate Balance 
  let balance = 0;
  for (const transaction of transactions) {
    balance = balance + transaction.price;
  }

  // Calculate Cents
  balance = balance.toFixed(2);
  const fraction = balance.split('.')[1];
  balance = balance.split('.')[0];

  return (
  <main>
    {/* Display Balance to user */}
    <h1>${balance}<span>{fraction}</span></h1>
    <form onSubmit={addNewTransaction}>
      {/* Example value inputs for a transaction */}
      <div className='basic'>
        <input type='text' 
               value={name}
               onChange={ev => setName(ev.target.value)}
               placeholder={'+200 new samsung tv'}/>
        <input value={datetime} 
               onChange={ev => setDatetime(ev.target.value)}
               type='datetime-local'/>
      </div>
      <div className="description">
        <input type='text' 
               value={description} 
               onChange={ev => setDescription(ev.target.value)} placeholder={'description'}/>
      </div>
      <button type="submit">Add new transaction</button>
    </form>

    {/* Iterate through transactions in MongoDB and display them to user */}
    <div className="transactions">
      {transactions.length > 0 && transactions.map(transaction => (
        <div className="transaction">
          <div className="left">
            <div className="name">{transaction.name}</div>
            <div className="description">{transaction.description}</div>
          </div>
          <div className="right">
            {/* Calculate whether transaction is adding or removing to balance */}
            <div className={"price " + ((transaction.price < 0) ? 'red' : 'green')}>
              {transaction.price}
            </div>
            <div className="datetime">{transaction.datetime}</div>
          </div>
        </div>
      ))}
    </div>
  </main>
  );
}

export default App;
