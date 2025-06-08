"use client";
import { useState, useEffect } from "react";
import Map from "@/components/Map/map.jsx";
import { QuizProvider } from "@/context/QuizContext.js";
import Button from "@/components/buttons/button";
import Styles from "./QuizPage.module.css";
import { useUser } from "@auth0/nextjs-auth0";
import Footer from "@/components/footer/footer";

function App() {
  const array = [
    "Afghanistan", "Angola", "Albania", "United Arab Emirates", "Argentina",
    "Armenia", "Antarctica", "French Southern and Antarctic Lands", "Australia",
    "Austria", "Azerbaijan", "Burundi", "Belgium", "Benin", "Burkina Faso",
    "Bangladesh", "Bulgaria", "The Bahamas", "Bosnia and Herzegovina",
    "Belarus", "Belize", "Bermuda", "Bolivia", "Brazil", "Brunei", "Bhutan",
    "Botswana", "Central African Republic", "Canada", "Switzerland", "Chile",
    "China", "Ivory Coast", "Cameroon", "Democratic Republic of the Congo",
    "Republic of the Congo", "Colombia", "Costa Rica", "Cuba", "Northern Cyprus",
    "Cyprus", "Czech Republic", "Germany", "Djibouti", "Denmark",
    "Dominican Republic", "Algeria", "Ecuador", "Egypt", "Eritrea", "Spain",
    "Estonia", "Ethiopia", "Finland", "Fiji", "Falkland Islands", "France",
    "Gabon", "United Kingdom", "Georgia", "Ghana", "Guinea", "Gambia",
    "Guinea Bissau", "Equatorial Guinea", "Greece", "Greenland", "Guatemala",
    "French Guiana", "Guyana", "Honduras", "Croatia", "Haiti", "Hungary",
    "Indonesia", "India", "Ireland", "Iran", "Iraq", "Iceland", "Israel",
    "Italy", "Jamaica", "Jordan", "Japan", "Kazakhstan", "Kenya", "Kyrgyzstan",
    "Cambodia", "South Korea", "Kosovo", "Kuwait", "Laos", "Lebanon", "Liberia",
    "Libya", "Sri Lanka", "Lesotho", "Lithuania", "Luxembourg", "Latvia",
    "Morocco", "Moldova", "Madagascar", "Mexico", "Macedonia", "Mali", "Malta",
    "Myanmar", "Montenegro", "Mongolia", "Mozambique", "Mauritania", "Malawi",
    "Malaysia", "Namibia", "New Caledonia", "Niger", "Nigeria", "Nicaragua",
    "Netherlands", "Norway", "Nepal", "New Zealand", "Oman", "Pakistan",
    "Panama", "Peru", "Philippines", "Papua New Guinea", "Poland", "Puerto Rico",
    "North Korea", "Portugal", "Paraguay", "Qatar", "Romania", "Russia",
    "Rwanda", "Western Sahara", "Saudi Arabia", "Sudan", "South Sudan",
    "Senegal", "Solomon Islands", "Sierra Leone", "El Salvador", "Somaliland",
    "Somalia", "Republic of Serbia", "Suriname", "Slovakia", "Slovenia",
    "Sweden", "Swaziland", "Syria", "Chad", "Togo", "Thailand", "Tajikistan",
    "Turkmenistan", "East Timor", "Trinidad and Tobago", "Tunisia", "Turkey",
    "Taiwan", "United Republic of Tanzania", "Uganda", "Ukraine", "Uruguay",
    "United States of America", "Uzbekistan", "Venezuela", "Vietnam", "Vanuatu",
    "West Bank", "Yemen", "South Africa", "Zambia", "Zimbabwe"
  ];

  const [countries, setCountries] = useState(array);
  const [country, setCountry] = useState("India");
  const [options, setOptions] = useState([]);
  const [level, setLevel] = useState(1);
  const [highLevel, setHighlevel] = useState(1);

  //user info
  const { user } = useUser();

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCountry = localStorage.getItem("currentCountry");
      const storedOptions = localStorage.getItem("options");
      const storedLevel = localStorage.getItem("level");
      const storedHighLevel = localStorage.getItem("highlevel");

      setCountry(storedCountry || "India");
      setOptions(storedOptions ? JSON.parse(storedOptions) : []);
      setLevel(storedLevel ? Number(storedLevel) : 1);
      setHighlevel(storedHighLevel ? Number(storedHighLevel) : 1);
    }
  }, []);


  const getRandomCountry = (excluded = []) => {
    const filteredCountries = countries.filter((c) => !excluded.includes(c));
    const randomIndex = Math.floor(Math.random() * filteredCountries.length);
    return filteredCountries[randomIndex];
  };

  const checkForHighlevel = async () => {
    if (level > highLevel) {
      setHighlevel(level);
      localStorage.setItem("highlevel", level);
      try {
        await fetch("/api/user/score", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ score: level,user }),
        });
      } catch (error) {
        console.error("Error updating high level:", error);
      }
    }
  };



  const generateOptions = (currentCountry) => {
    const correctCountry = currentCountry;
    const option1 = getRandomCountry([correctCountry]);
    const option2 = getRandomCountry([correctCountry, option1]);
    const option3 = getRandomCountry([correctCountry, option1, option2]);
    const optionsArray = [correctCountry, option1, option2, option3];
    for (let i = 3; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [optionsArray[i], optionsArray[j]] = [optionsArray[j], optionsArray[i]];
    }
    return optionsArray;
  };

  useEffect(() => {
    if (
      country &&
      options.length === 0 &&
      !localStorage.getItem("options") // Only generate if localStorage has no options
    ) {
      const newOptions = generateOptions(country);
      setOptions(newOptions);
      localStorage.setItem("options", JSON.stringify(newOptions));
    }
  }, [country]);

  const nextQuestion = () => {
    const randomCountry = getRandomCountry();
    setCountry(randomCountry);
    setCountries((prev) => prev.filter((c) => c !== randomCountry));

    const newOptions = generateOptions(randomCountry);
    setOptions(newOptions);

    localStorage.setItem("currentCountry", randomCountry);
    localStorage.setItem("options", JSON.stringify(newOptions));
  };

  const currentQuestion = () => {
    return country;
  };

  const isCorrect = async (e) => {
    const selectedOption = e.target.innerText;
    console.log("Selected Option:", selectedOption);

    if (selectedOption === country) {
      const newLevel = level + 1;
      setLevel(newLevel);
      localStorage.setItem("level", newLevel);
      nextQuestion();
    } else {
      alert("Wrong! Try again. Correct answer was " + currentQuestion());
      await checkForHighlevel();
      setLevel(1);
      localStorage.setItem("level", 1);
      nextQuestion();
    }
  };


  return (
    <QuizProvider value={{ currentQuestion, isCorrect, nextQuestion }}>
      <div className={Styles.page}>
        <div className={Styles.container}>
          <h1 style={{
                    marginTop: "40px",
                    width: "100%",
                    color: "white",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}>Guess The Highlighted Country</h1>
          <div
          style={{
                backgroundColor: "rgba(0,0,0,0)",
                marginTop: "20px",
                marginBottom: "0px",
                display: "flex",
                flexDirection: "row-reverse",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px"
            }}>
          <span className={Styles.tab}>Highest Level : {highLevel}</span>
          <span className={Styles.tab}>Current Level : {level}</span>
          </div>
          <div className={Styles.mapContainer}>
            <Map country={currentQuestion()} />
          </div>
          <div className={Styles.optionContainer}>
            {options.map((opps) => (
              <div key={opps} className={Styles.option}>
                <Button
                  onClick={isCorrect}
                  text={opps}
                  variant={"Secondary"}
                >
                  {opps}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </QuizProvider>
  );
}

export default App;