import React, { useState, useEffect } from "react";
import useClickOutside from "../hooks/useClickOutside";
import bg from "./assets/bg-home.png";
import ellipses from "./assets/ellipses.png";

const AddExpense = ({ transactions, setTransactions }) => {
  const [transactType, setTransactType] = useState(1);

  const [inputValue, setInputValue] = useState("");
  const [selector, setSelector] = useState(false);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  const [typeTrack, setTypeTrack] = useState(1);
  const generateNewId = () => {
    const maxId = transactions.reduce(
      (max, transaction) => Math.max(max, transaction.id),
      0
    );
    return maxId + 1;
  };


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-GB', options);
  
    // Extract day, month, and year from formatted date
    const [, day, month, year] = formattedDate.match(/^(\d+)\s(\w+)\s(\d+)$/);
  
    // Convert day to ordinal format (e.g., 1st, 2nd, 3rd, etc.)
    let ordinalDay;
    if (day == 11 || day == 12 || day == 13) {
      ordinalDay = day + "th";
    } else {
      switch (day % 10) {
        case 1:
          ordinalDay = day + "st";
          break;
        case 2:
          ordinalDay = day + "nd";
          break;
        case 3:
          ordinalDay = day + "rd";
          break;
        default:
          ordinalDay = day + "th";
          break;
      }
    }
  
    return `${ordinalDay} ${month}, ${year}`;
  };



  const closeOption = () => {
    setSelector(false);
  };

  const dropdownRef = useClickOutside(closeOption);

 
  

  const addTransaction = (e) => {
    e.preventDefault();
    if(date !== "" && !isNaN(amount) && name !== "" ){
      const formattedNewDate = formatDate(date); // Format the date before adding to transactions

      setTransactions((prev) => [
        ...prev,
      {
        name: name.charAt(0).toUpperCase() + name.slice(1),
        amount: formattedAmount,
        date: formattedNewDate,
        id: generateNewId(),
        type: typeTrack,
      },
    ]);
  }
  };
  useEffect(() => {
    console.log(transactions);
  }, [transactions]);
  useEffect(() => {
    console.log(date);
  }, [date]);

  const selection = [
    {
      value: "Income",
      type: 1,
      function: () => {
        setTypeTrack(1);
        setSelector(false);
      },
    },
    {
      value: "Expense",
      type: 2,
      function: () => {
        setTypeTrack(2);
        setSelector(false);
      },
    },
  ];

  const formattedNumber = (number) => {
    // Convert the string to a number
    const numericValue = parseFloat(number);

    // Check if the input is a valid number
    if (isNaN(numericValue)) {
      return ""; // Return an empty string if it's not a valid number
    }

    // Format the number with two decimal places and comma separators
    return numericValue.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };
  const formattedAmount = formattedNumber(amount);



  return (
    <div>
      <img
        src={ellipses}
        className="absolute top-0 z-20 w-[50%] cover"
        alt=""
      />

      <img src={bg} className="relative cover w-full" alt="" />
      <header className="flex text-white absolute top-10 rid grid-cols-3 flex-row w-full justify-between   p-6">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-chevron-left"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </div>

        <p className="font-semibold">
          Add {typeTrack === 1 ? "Income" : "Expense"}
        </p>
        <button ref={dropdownRef} onClick={() => setSelector((prev) => !prev)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-ellipsis"
          >
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
          </svg>
        </button>
      </header>

      <div className="absolute float border z-50 top-[90px] right-6  flex flex-col rounded-md bg-white  ">
        {selector &&
          selection.map((select) => (
            <button
              key={select.type}
              onClick={select.function}
              className={`${select.type === 1 && "border-b"} py-1 px-4`}
            >
              {select.value}
            </button>
          ))}
      </div>
      <form
       onSubmit={addTransaction}
        className="addForm p-9 py-6 w-[90%] h-[70%] shadow-lg rounded-lg justify-between bg-white flex flex-col absolute  top-[20%] text-xl font-semibold  mx-auto left-0 right-0 "
        
      >
        <div>
          <label className="text-sm text-[#666666]" htmlFor="name">
            Name
          </label>
          <br />
          <input
            className="p-2   text-[#666666]"
            type="text"
            name="name"
            id="Name"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="relative ">
          <label className="text-sm text-[#666666]" htmlFor="amount">
            Amount
          </label>
          <br />
          <p className="absolute left-3 top-[2.55rem] text-sm  ">&#36;</p>
          <input
            type="text"
            className="px-6 pr-12 py-2"
            name="amount"
            id="amount"
            // value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button
        
            onClick={(e) => {
              e.preventDefault();
              setAmount("");
            }}
            className="absolute text-sm text-[#666666] right-1 p-2 top-[2rem]"
          >
            Clear
          </button>
        </div>
        <div className="w-full ">
          <label className="text-sm text-[#666666]" htmlFor="date">
            Date
          </label>
          <br />
          <input
            type="date"
            name="date"
            onChange={(e) => setDate(e.target.value)}
            value={date}
            className="p-2 w-full"
            id="date"
          />
        </div>
        <button
          type="submit"
         
          className={`hover:bg-[#438883] ${typeTrack ===1 ? "text-green-600" : "text-red-600"} py-2 border rounded-lg w-full flex items-center justify-center hover:text-white my-3`}
        >
          Add {typeTrack === 1 ? "Income" : "Expense"}
        </button>
      </form>
    </div>
  );
};

export default AddExpense;
