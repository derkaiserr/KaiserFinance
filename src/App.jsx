import { useState, useEffect, useContext } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import date from "date-and-time";
import GetStarted from "./getStarted";
import { SignUp } from "./signUp/signUp.jsx";
import Login from "./logIn/login.jsx";
import PageOne from "./homePage/home.jsx";
import Stats from "./statisticsPage/stats.jsx";
import User from "./user.jsx";
import bars from "./assets/bars.svg";
import user from "./assets/user.svg";
import home from "./assets/home.svg";
import wallet from "./assets/wallet.svg";
import greenBars from "./assets/greenBars.svg";
import greenUser from "./assets/greenUser.svg";
import greenHome from "./assets/greenHome.svg";
import greenWallet from "./assets/greenWallet.svg";
import "./App.css";
import AddExpense from "./homePage/add.jsx";
// import { AuthProvider } from "./firebase/auth.jsx";
import { AuthProvider } from "./firebase/auth.jsx";
import Context from "../hooks/context/context.js";
// import { SignIn, Register } from "./firebase/auth.js";
import { ref, listAll, getDownloadURL,  } from "firebase/storage";
import { imageDb, auth, db } from "./firebase/firebase.js";
import { onAuthStateChanged } from "firebase/auth";
// 'X-RapidAPI-Key':import.meta.env.VITE_SOME_KEY
function App() {
  let saveLocation = window.location.pathname;

  // const { error, manageError } = useContext(AuthContext);
  const navigate = useNavigate();
  const [imgUrl, setImgUrl] = useState(() => {
    // Retrieve initial state from localStorage if it exists, otherwise use an empty array
    const savedImgUrl = localStorage.getItem("imgUrl");
    return savedImgUrl ? JSON.parse(savedImgUrl) : [];
  });

  useEffect(() => {
    // Save imgUrl to localStorage whenever it changes
    localStorage.setItem("imgUrl", JSON.stringify(imgUrl));
  }, [imgUrl]);
  const [selectedImage, setSelectedImage] = useState("");
  const [reloadImage, setReloadImage] = useState(false);
  const [matchingName, setMatchingName] = useState(null);
  const [nav, setNav] = useState(() => {
    const storedNav = localStorage.getItem("nav");
    return storedNav ? JSON.parse(storedNav) : false; // Parse JSON string to boolean
  });
  const [error, manageError] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [currency, setCurrency] = useState(
    localStorage.getItem("currency") || "🇺🇸"
  );

  useEffect(() => {
    // Set a timer to hide the element after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      manageError("")
    }, 5000);

    // Clear the timer if the component is unmounted before 5 seconds
    return () => clearTimeout(timer);
  }, [isVisible === true]);
  // Update local storage whenever the nav state changes
  useEffect(() => {
    localStorage.setItem("nav", JSON.stringify(nav));
  }, [nav]); // Run this effect whenever nav changes

  // const savedNav = (link) => {
  //   setNav(link.to);
  // };

  const [activeLink, setActiveLink] = useState(1);

  // useEffect(() => {
  //   localStorage.setItem("activeLink", JSON.stringify(activeLink));
  // }, [activeLink])

  // const data = 1;

  const now = new Date(2014, 1, 11);
  const newDate = date.format(now, "ddd, MMM DD YYYY");
  // console.log(newDate)

  const navLinks = [
    { img: home, altImg: greenHome, id: 1, to: "/home" },
    { img: bars, altImg: greenBars, id: 2, to: "/stats" },
    { img: "", altImg: "", id: 3 },
    { img: wallet, altImg: wallet, id: 4, to: "/home" },
    { img: user, altImg: greenUser, id: 5, to: "/user" },
  ];

  const dateFunction = (year, month, day) => {
    return date.format(new Date(year, month, day), "MMM DD, YYYY");
  };

  // const formattedNumber = (number) => {
  //   // Convert the string to a number
  //   const numericValue = parseFloat(number);

  //   // Check if the input is a valid number
  //   if (isNaN(numericValue)) {
  //     return ""; // Return an empty string if it's not a valid number
  //   }

  //   // Format the number with two decimal places and comma separators
  //   return numericValue.toLocaleString(undefined, {
  //     minimumFractionDigits: 2,
  //     maximumFractionDigits: 2,
  //   });
  // };

  const [localCurrency, setLocalCurrency] = useState(1);

  const API_KEY = import.meta.env.VITE_SOME_KEY;
  // const [currencyState, setCurrencyState] = useState(0);

  const [currencyState, setCurrencyState] = useState(1250);
  const [currencySymbol, setCurrencySymbol] = useState("$");

  // console.log(currencyState * "3")
  // const addRate = useCallback((rate) => {
  //   setCurrencyState(rate);
  // }, []);

  // addRate(1250);

  // const currencyMemo = useMemo(() => {
  //   return fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`)
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch exchange rate");
  //       }
  //       return response.json();
  //     })
  //     .then((data) => {
  //       addRate(data.conversion_rates.NGN);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching exchange rate:", error);
  //     });
  // }, [addRate]);

  // useEffect(() => {
  //   // Inside useEffect, we need to execute the promise returned by currencyMemo
  //   currencyMemo
  //     .then(() => {
  //       // Fetch operation completed, do something if needed
  //     })
  //     .catch((error) => {
  //       // Handle fetch error if needed
  //     });
  // }, [currencyMemo]);

  // Use currencyState in your component
  // const updatedTransactions =

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userIn, setUserIn] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
            setUserIn(currentUser);
            fetchTransactions(currentUser);
        } else {
            setUserIn(null);
            setLoading(false);
            // navigate('/login'); // Redirect to login if user is not authenticated
        }
    });

    return () => unsubscribe();
}, [auth, navigate]);

const fetchTransactions = async (currentUser) => {
    try {
      setLoading(true);
        const q = query(collection(db, 'transactions'), where('userId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        const transactionsData = [];
        querySnapshot.forEach((docSnapshot) => {
            transactionsData.push({ ...docSnapshot.data(), id: docSnapshot.id });
        });
        setTransactions(transactionsData);
    } catch (err) {
        console.error("Error fetching transactions: ", err);
    } finally {
        setLoading(false); // Set loading to false once data is fetched
    }
};

const resetTransactions = async () => {
  if (!auth.currentUser) {
      console.log("User is not authenticated");
      navigate('/login'); // Redirect to login if user is not authenticated
      return;
  }

  try {
      const q = query(collection(db, 'transactions'), where('userId', '==', auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
      const deletePromises = [];
      querySnapshot.forEach((docSnapshot) => {
          deletePromises.push(deleteDoc(doc(db, 'transactions', docSnapshot.id)));
      });
      await Promise.all(deletePromises);
      console.log('All transactions deleted');
      setTransactions([]); // Clear the transactions state
  } catch (err) {
      console.error("Error deleting transactions: ", err);
  }
};


  // transactions.map((transaction) => transaction.amount * localCurrency)
  // const updatedTx = transactions.map(item => ({
  //   ...item,
  //   amount: item.amount  * localCurrency,
  // }));
  // console.log(updatedTx)
  // useEffect(()=>
  // setTransactions(updatedTx),[])

  // const value = transactions[0].amount;
  // const [values, setValues] = useState(3 * localCurrency);

  // let sortedTransactions
  const sortedTransactions = transactions.slice().sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA - dateB;
  });

  // Example of updating the transactions state

  // Create a new array with updated transaction objects

  // Update the transactions state with the new array
  // useEffect(() => {
  //   setTransactions(updatedTransactions);
  // }, [localCurrency]);

  // transactions.map((transaction) => console.log( new Date (transaction.date)))

  // console.log(sortedTransactions);




  const handleNavLinkClick = (id) => {
    setActiveLink(id);
  };

  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );
  useEffect(() => {
    localStorage.setItem("theme", theme);

    document.body.className = theme;
  }, [theme]);
  const toggleDarkMode = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // console.log(currencyState);

  useEffect(() => {
    if (!auth.currentUser) {
      return;
    }

    const fetchImages = async () => {
      try {
        const imagesRef = ref(imageDb, `${auth.currentUser?.email}`);
        const imgs = await listAll(imagesRef);

        if (imgs.items.length === 0) {
          return;
        }

        // console.log(imgs); // Check the structure and content of imgs

        const urls = await Promise.all(
          imgs.items.map(async (val) => {
            const url = await getDownloadURL(val);
            return url;
          })
        );
        
        setImgUrl(urls);
      } catch (error) {
        // console.error("Error fetching images: ", error);
      }finally{
      }

    };

    fetchImages();
  }, [ auth.currentUser, reloadImage]);


  useEffect(() => {
    if (currency === "🇺🇸") {
      setLocalCurrency(1);
      setCurrencySymbol("$");
    } else if (currency === "🇳🇬") {
      setLocalCurrency(currencyState);
      setCurrencySymbol("₦");
    }
  },[currency])

  return (
    <Context.Provider
      value={{
        setNav,
        nav,
        theme,
        setTheme,
        currencyState,
        currencySymbol,
        setCurrencyState,
        setCurrencySymbol,
        localCurrency,
        setLocalCurrency,
        transactions,
        setTransactions,
        toggleDarkMode,
        sortedTransactions,
        navigate,
        imgUrl,
        setImgUrl,
        selectedImage,
        setSelectedImage,
        matchingName,
        setMatchingName,
        setReloadImage,
        error,
        manageError,
        isVisible,
        setIsVisible,
        resetTransactions,
        loading, 
        setLoading, 
        currency,
        setCurrency,
        
      }}
    >
      <AuthProvider>
      <div className={`${theme} inter  `}>
        <Routes>
          <Route
            path="/"
            element={<GetStarted theme={theme} setNav={setNav} />}
          />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/login" element={<Login />} />

          <Route path="/add" element={<AddExpense />} />
          <Route path="/home" element={<PageOne />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/user" element={<User />} />
          {/* <Route path="./firebase/auth.js" element={<Register/>} /> */}
          {/* <Route path="./firebase/auth" element={SignIn()} /> */}
        </Routes>

        {nav && (
          <footer className="fixed bg-white flex z-[100] py-3 pt-4 bottom-0 w-full justify-around border border-t-2">
            {navLinks.map((nav) => (
              <Link
                to={nav.to}
                key={nav.id}
                onClick={() => handleNavLinkClick(nav.id)}
                className={activeLink === nav.id ? "active" : ""}
              >
                <img
                  src={saveLocation === nav.to ? nav.altImg : nav.img}
                  alt=""
                />
              </Link>
            ))}
          </footer>
        )}
      </div>
      </AuthProvider>
    </Context.Provider>
    //
  );
}

export default App;
