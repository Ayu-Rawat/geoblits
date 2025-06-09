"use client";
import { useState, useEffect } from "react";
import Map from "@/components/Map/map.jsx";
import { QuizProvider } from "@/context/QuizContext.js";
import Button from "@/components/buttons/button";
import Styles from "./QuizPage.module.css";
import { useUser } from "@auth0/nextjs-auth0";
import Footer from "@/components/footer/footer";
import Dialog from "@/components/dialog-box/dialog-box.jsx";
import Link from "next/link";

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
  const [endGameData, setEndGameData] = useState({})
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loding, setloding] = useState(false);
  const [countries, setCountries] = useState(array);
  const [country, setCountry] = useState("India");
  const [options, setOptions] = useState([]);
  const [level, setLevel] = useState(1);
  const [highLevel, setHighlevel] = useState(1);

  const { user, isLoading } = useUser();

  function getEndGameData(score) {
    if (score <= 1) {
      return {
        title: "🤡 Clown",
        line: "Did you click with your eyes closed? 💀",
      };
    }
    if (score <= 3) {
      return {
        title: "🙃 Could Be Worse",
        line: "At least you didn’t get zero… I guess?",
      };
    }
    if (score <= 6) {
      return {
        title: "😌 Not Bad",
        line: "You're getting there, one guess at a time.",
      };
    }
    if (score <= 10) {
      return {
        title: "😎 Well Played",
        line: "You’re flexing just a little. Respect.",
      };
    }
    if (score <= 20) {
      return {
        title: "🔥 Certified Pro",
        line: "You might actually know stuff 😮",
      };
    }
    if (score <= 50) {
      return {
        title: "🎬 Absolute Cinema",
        line: "Oscar-worthy performance. Truly peak.",
      };
    }
    return {
      title: "🧠 GOD TIER",
      line: "We’re not worthy 🙇 You win at life.",
    };
  }


  let endGame;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCountry = localStorage.getItem("currentCountry");
      const storedOptions = localStorage.getItem("options");
      const storedLevel = localStorage.getItem("level");
      const storedHighLevel = localStorage.getItem("highlevel");

      setCountry(storedCountry || "India");
      setOptions(storedOptions ? JSON.parse(storedOptions) : []);
      setLevel(storedLevel ? Number(storedLevel) : 0);
      setHighlevel(storedHighLevel ? Number(storedHighLevel) : 0);
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
          body: JSON.stringify({ score: level, user }),
        });
      } catch (error) {
        console.error("Error updating high level:", error);
      }finally {
        setloding(false);
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
      !localStorage.getItem("options")
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
    if (selectedOption === country) {
      const newLevel = level + 1;
      setLevel(newLevel);
      localStorage.setItem("level", newLevel);
      nextQuestion();
    } else {
      endGame = getEndGameData(level);
      setEndGameData(endGame);
      setDialogOpen(true);
      await checkForHighlevel();
      setLevel(1);
      localStorage.setItem("level", 1);
    }
  };

  if (isLoading || loding) {
    return <div style={{ color: "white", textAlign: "center", marginTop: "2rem" }}>Loading...</div>;
  }

  return (<>
    <Dialog isOpen={dialogOpen} setIsOpen={setDialogOpen}>
      <h1
        style={{
          fontFamily: "Roboto, sans-serif",
          fontSize: "24px",
          fontWeight: "200",
          margin: "10px 5px 20px",
          lineHeight: "24px",
          color: "white",
          textAlign: "center",
          fontSize: "2rem",
        }}
      >
        Game Over
      </h1>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h1 style={{color : "White",marginTop:"10px",marginBottom:"10px"}}>{endGameData.title}</h1>
        <p style={{color : "White",marginBottom:"10px"}}>{endGameData.line}</p>
        <p style={{ color: "white", marginBottom: "20px" }}>
          Your score is {level}, The highest score is {highLevel}
        </p>
      </div>
      <div 
      style={{
        display: "flex",
        gap: "10px",
        justifyContent: "center",
      }}
      >
        <Button onClick={() => {setDialogOpen(false);nextQuestion()}} text="Retry" variant="Secondary" width={120}/>
        <Link href="/leaderboard">
          <Button onClick={() => {setDialogOpen(false);nextQuestion()}} text="Leader Board" variant="Outline" width={130}/>
        </Link>
      </div>
    </Dialog>
    <QuizProvider value={{ currentQuestion, isCorrect, nextQuestion }}>
      <div className={Styles.page}>
        <div className={Styles.container}>
          <h1 className={Styles.title}>Guess The Highlighted Country</h1>
          <div
            style={{
              backgroundColor: "rgba(0,0,0,0)",
              marginTop: "20px",
              marginBottom: "0px",
              display: "flex",
              flexDirection: "row-reverse",
              justifyContent: "center",
              alignItems: "center",
              gap: "20px"
            }}>
            <span className={Styles.tab}>Highest Score : {highLevel}</span>
            <span className={Styles.tab}>Current Score : {level}</span>
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
    </QuizProvider>
      <Footer />
    </>
  );
}

export default App;
