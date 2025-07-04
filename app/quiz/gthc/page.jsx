"use client";
import { decryptData,encryptData } from "@/utils/encryption.js";
import { useEffect, useState } from "react";
import { QuizProvider } from "@/context/QuizContext.js";
import Button from "@/components/buttons/button";
import Styles from "./QuizPage.module.css";
import { useUser } from "@auth0/nextjs-auth0";
import Footer from "@/components/footer/footer";
import Dialog from "@/components/dialog-box/dialog-box.jsx";
import Link from "next/link";
import Loading from "@/components/loading/Loading";
import Map from "@/components/Map/map.jsx";

const COUNTRY_LIST = [
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

const COUNTRY_REGION_MAP = {
  "Afghanistan": "Asia", "Albania": "Europe", "Algeria": "Africa", "Andorra": "Europe",
  "Angola": "Africa", "Antarctica": "Antarctica", "Argentina": "South America", "Armenia": "Asia",
  "Australia": "Oceania", "Austria": "Europe", "Azerbaijan": "Asia", "Bahamas": "North America",
  "Bahrain": "Asia", "Bangladesh": "Asia", "Barbados": "North America", "Belarus": "Europe",
  "Belgium": "Europe", "Belize": "North America", "Benin": "Africa", "Bhutan": "Asia",
  "Bolivia": "South America", "Bosnia and Herzegovina": "Europe", "Botswana": "Africa",
  "Brazil": "South America", "Brunei": "Asia", "Bulgaria": "Europe", "Burkina Faso": "Africa",
  "Burundi": "Africa", "Cambodia": "Asia", "Cameroon": "Africa", "Canada": "North America",
  "Cape Verde": "Africa", "Central African Republic": "Africa", "Chad": "Africa", "Chile": "South America",
  "China": "Asia", "Colombia": "South America", "Comoros": "Africa", "Congo": "Africa",
  "Costa Rica": "North America", "Croatia": "Europe", "Cuba": "North America", "Cyprus": "Asia",
  "Czech Republic": "Europe", "Denmark": "Europe", "Djibouti": "Africa", "Dominican Republic": "North America",
  "Ecuador": "South America", "Egypt": "Africa", "El Salvador": "North America", "Equatorial Guinea": "Africa",
  "Eritrea": "Africa", "Estonia": "Europe", "Eswatini": "Africa", "Ethiopia": "Africa", "Fiji": "Oceania",
  "Finland": "Europe", "France": "Europe", "Gabon": "Africa", "Gambia": "Africa", "Georgia": "Asia",
  "Germany": "Europe", "Ghana": "Africa", "Greece": "Europe", "Greenland": "North America",
  "Guatemala": "North America", "Guinea": "Africa", "Guinea Bissau": "Africa", "Guyana": "South America",
  "Haiti": "North America", "Honduras": "North America", "Hungary": "Europe", "Iceland": "Europe",
  "India": "Asia", "Indonesia": "Asia", "Iran": "Asia", "Iraq": "Asia", "Ireland": "Europe",
  "Israel": "Asia", "Italy": "Europe", "Ivory Coast": "Africa", "Jamaica": "North America",
  "Japan": "Asia", "Jordan": "Asia", "Kazakhstan": "Asia", "Kenya": "Africa", "Kuwait": "Asia",
  "Kyrgyzstan": "Asia", "Laos": "Asia", "Latvia": "Europe", "Lebanon": "Asia", "Lesotho": "Africa",
  "Liberia": "Africa", "Libya": "Africa", "Lithuania": "Europe", "Luxembourg": "Europe",
  "Madagascar": "Africa", "Malawi": "Africa", "Malaysia": "Asia", "Maldives": "Asia", "Mali": "Africa",
  "Malta": "Europe", "Mauritania": "Africa", "Mexico": "North America", "Moldova": "Europe",
  "Monaco": "Europe", "Mongolia": "Asia", "Montenegro": "Europe", "Morocco": "Africa",
  "Mozambique": "Africa", "Myanmar": "Asia", "Namibia": "Africa", "Nepal": "Asia",
  "Netherlands": "Europe", "New Zealand": "Oceania", "Nicaragua": "North America",
  "Niger": "Africa", "Nigeria": "Africa", "North Korea": "Asia", "North Macedonia": "Europe",
  "Norway": "Europe", "Oman": "Asia", "Pakistan": "Asia", "Panama": "North America",
  "Papua New Guinea": "Oceania", "Paraguay": "South America", "Peru": "South America",
  "Philippines": "Asia", "Poland": "Europe", "Portugal": "Europe", "Qatar": "Asia",
  "Republic of the Congo": "Africa", "Romania": "Europe", "Russia": "Asia", "Rwanda": "Africa",
  "Saudi Arabia": "Asia", "Senegal": "Africa", "Serbia": "Europe", "Sierra Leone": "Africa",
  "Singapore": "Asia", "Slovakia": "Europe", "Slovenia": "Europe", "Somalia": "Africa",
  "South Africa": "Africa", "South Korea": "Asia", "South Sudan": "Africa", "Spain": "Europe",
  "Sri Lanka": "Asia", "Sudan": "Africa", "Suriname": "South America", "Sweden": "Europe",
  "Switzerland": "Europe", "Syria": "Asia", "Taiwan": "Asia", "Tajikistan": "Asia",
  "Tanzania": "Africa", "Thailand": "Asia", "Timor-Leste": "Asia", "Togo": "Africa",
  "Trinidad and Tobago": "North America", "Tunisia": "Africa", "Turkey": "Asia", "Turkmenistan": "Asia",
  "Uganda": "Africa", "Ukraine": "Europe", "United Arab Emirates": "Asia",
  "United Kingdom": "Europe", "United States of America": "North America",
  "Uruguay": "South America", "Uzbekistan": "Asia", "Vanuatu": "Oceania",
  "Venezuela": "South America", "Vietnam": "Asia", "Western Sahara": "Africa",
  "Yemen": "Asia", "Zambia": "Africa", "Zimbabwe": "Africa"
};


function App() {
  const [isCorrect, setIsCorrect] = useState(false);
  const [endGameData, setEndGameData] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState(COUNTRY_LIST);
  const [country, setCountry] = useState("United States of America");
  const [options, setOptions] = useState([]);
  const [level, setLevel] = useState(0);
  const [highLevel, setHighLevel] = useState(0);

  const { user, isLoading } = useUser();

  useEffect(() => {
    const storedOptions = localStorage.getItem("options");
    if (storedOptions) {
      setOptions(JSON.parse(storedOptions));
    }
  }, []);

  useEffect(() => {
    const fetchScore = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const [highScoreRes, currentScoreRes, userProgressRes] = await Promise.all([
          fetch("/api/user/get-score", {
            method: "POST",
            body: JSON.stringify({ game_no: 1 }),
            headers: { "Content-Type": "application/json" },
          }),
          fetch("/api/user/get-current-score", {
            method: "POST",
            body: JSON.stringify({ game_no: 1 }),
            headers: { "Content-Type": "application/json" },
          }),
          fetch("/api/user/get-current-answer", {
            method: "POST",
            body: JSON.stringify({ game_no: 1 }),
            headers: { "Content-Type": "application/json" },
          })
        ]);

        const highScoreData = await highScoreRes.json();
        const currentScoreData = await currentScoreRes.json();
        const userData = await userProgressRes.json();

        setHighLevel(highScoreData.score || 0);
        setLevel(currentScoreData.score || 0);
        if (userData.statusCode === 200) {
          setCountry(decryptData(userData.user.question) || "United States of America");
        }
      } catch (err) {
        console.error("Error fetching scores or progress", err);
      } finally {
        setLoading(false);
      }
    };
    fetchScore();
  }, [user]);

  const getRandomCountry = (exclude = []) => {
    const available = countries.filter((c) => !exclude.includes(c));
    return available[Math.floor(Math.random() * available.length)];
  };

  const generateOptions = (correct) => {
    const region = COUNTRY_REGION_MAP[correct];

    let filteredCountries = countries.filter(
      (c) => c !== correct && COUNTRY_REGION_MAP[c] === region
    );

    if (filteredCountries.length < 3) {
      filteredCountries = countries.filter((c) => c !== correct);
    }

    const optionSet = new Set([correct]);
    while (optionSet.size < 4 && filteredCountries.length > 0) {
      const randomCountry = filteredCountries[Math.floor(Math.random() * filteredCountries.length)];
      optionSet.add(randomCountry);
    }

    while (optionSet.size < 4) {
      optionSet.add(getRandomCountry([...optionSet]));
    }

    return Array.from(optionSet).sort(() => Math.random() - 0.5);
  };


  useEffect(() => {
    if (country && options.length === 0 && !localStorage.getItem("options")) {
      const newOptions = generateOptions(country);
      setOptions(newOptions);
      localStorage.setItem("options", JSON.stringify(newOptions));
    }
  }, [country]);

  const getEndGameData = (score) => {
    if (score <= 3) return { title: "🤡 Clown", line: "Did you click with your eyes closed? 💀" };
    if (score <= 6) return { title: "🙃 Could Be Worse", line: "At least you didn’t get zero… I guess?" };
    if (score <= 10) return { title: "😌 Not Bad", line: "You're getting there, one guess at a time." };
    if (score <= 25) return { title: "😎 Well Played", line: "You’re flexing just a little. Respect." };
    if (score <= 60) return { title: "🔥 Certified Pro", line: "You might actually know stuff 😮" };
    if (score <= 100) return { title: "🎬 Absolute Cinema", line: "Oscar-worthy performance. Truly peak." };
    return { title: "🧠 GOD TIER", line: "We’re not worthy 🙇 You win at life." };
  };

  const nextQuestion = async () => {
    const newCountry = getRandomCountry();
    setCountry(newCountry);
    setCountries((prev) => prev.filter((c) => c !== newCountry));

    const newOptions = generateOptions(newCountry);
    setOptions(newOptions);
    localStorage.setItem("options", JSON.stringify(newOptions));

    Promise.all([
      fetch("/api/user/track-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ current_question: encryptData(newCountry), game_no: 1 })
      })
    ]);

    setLevel((prev) => prev + 1);
  };

const handleAnswer = async (e) => {
  const selected = e.target.innerText;
  const correct = selected === country;
  setIsCorrect(correct);

  try {
    fetch("/api/user/track-score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_correct: correct , game_no: 1 })
    });
  } catch (err) {
    console.error("Error tracking score", err);
  }

  if (correct) {
     const newLevel = level + 1;
    if (newLevel > highLevel) {
      setHighLevel(newLevel);
      try {
        setLoading(true);
        await fetch("/api/user/score", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ selected_option: selected, game_no: 1 })
        });
        setLoading(false);
      } catch (err) {
        console.error("Error updating high score", err);
      }
    }


    await nextQuestion();
  } else {
    setEndGameData(getEndGameData(level));
    setDialogOpen(true);
    setLevel(-1);
  }
};

  if (isLoading || loading) return <Loading />;
  return (
    <>
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
        }}>Game Over</h1>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <h1 style={{color : "White",marginTop:"10px",marginBottom:"10px"}}>{endGameData.title}</h1>
          <p style={{color : "White",marginBottom:"10px"}}>{endGameData.line}</p>
          <p style={{ color: "white", marginBottom: "20px" }}>Your Highest score is {highLevel}</p>
        </div>
        <div style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",}}>
          <Button onClick={() => { setDialogOpen(false); nextQuestion(); }} text="Retry" variant="Secondary" width={120} />
          <Link href="/leaderboard">
            <Button onClick={() => setDialogOpen(false)} text="Leader Board" variant="Outline" width={130} />
          </Link>
        </div>
      </Dialog>

      <QuizProvider value={{ currentQuestion: () => country, isCorrect: handleAnswer, nextQuestion }}>
        <div className={Styles.page}>
          <div className={Styles.container}>
            <h1 className={Styles.title}>Guess The Highlighted Country</h1>
            <div className={Styles.scoreBar}     style={{
              backgroundColor: "rgba(0,0,0,0)",
              marginTop: "20px",
              marginBottom: "0px",
              display: "flex",
              flexDirection: "row-reverse",
              justifyContent: "center",
              alignItems: "center",
              gap: "20px"
            }}>
              <span className={Styles.tab}>Highest Score: {highLevel}</span>
              <span className={Styles.tab}>Current Score: {level}</span>
            </div>
            <div className={Styles.mapContainer}>
              <Map 
                country={country}
                height={
                window.innerWidth < 600
                    ? "160"
                    : "350"
                }
              />
            </div>
            <div className={Styles.optionContainer}>
              {options.map((option) => (
                <div key={option} className={Styles.option}>
                  <Button height={50} onClick={handleAnswer} text={option} variant="Secondary" />
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