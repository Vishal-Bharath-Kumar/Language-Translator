import { useState } from "react";
import "./Translator.css";
import languageList from "../constants/Language.json";
import { ToastContainer, toast } from "react-toastify";
import { RAPID_API_KEY, RAPID_API_HOST } from "../constants/ApiKeys";
import LoaderButton from "./LoaderButton";
import TranslateButton from "./TranslateButton";

export default function Translator() {
  const [inputFormat, setInputFormat] = useState("en");
  const [outputFormat, setOutputFormat] = useState("ta");
  const [translatedText, setTranslatedText] = useState("Translation");
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReverseLanguage = () => {
    const value = inputFormat;
    setInputFormat(outputFormat);
    setOutputFormat(value);
    setInputText("");
    setTranslatedText("Translation");
  };

  const handleRemoveInputText = () => {
    setInputText("");
    setTranslatedText("Translation");
  };

  const handleTranslate = async () => {
    if (!inputText || !inputFormat || !outputFormat) {
      return toast.warning("Provide the text for translation");
    }

    const url = `https://microsoft-translator-text.p.rapidapi.com/translate?to%5B0%5D=${outputFormat}&api-version=3.0&profanityAction=NoAction&textType=plain`;
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": RAPID_API_KEY,
        "X-RapidAPI-Host": RAPID_API_HOST,
      },
      body: JSON.stringify([
        {
          Text: inputText,
        },
      ]),
    };
    try {
      setLoading(true);
      const response = await fetch(url, options);
      const result = await response.text();
      const responseObject = JSON.parse(result);
      const translation = responseObject[0].translations[0].text;
      setTranslatedText(translation);
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Error Occurred! Try again");
    }
  };
  const textSpeech = async () => {
    if (!window.speechSynthesis) {
      toast.error("Your browser version not supported!");
    }
    const utterance = new SpeechSynthesisUtterance(translatedText);
    console.log(translatedText);
    utterance.lang = outputFormat;
    window.speechSynthesis.speak(utterance);
  };
  const copyText = async() =>{
    {translatedText === 'Translation' ?(
      navigator.clipboard.writeText('') &&
      toast.warning("No text to be copied")
    ):(
      navigator.clipboard.writeText(translatedText) &&
      toast.success("Text copied")
    )}    
  }
  return (
    <>
      <h1 className="header">Language Translator</h1>
      <div className="container">
        <div className="row1">
          <select
            value={inputFormat}
            onChange={(e) => setInputFormat(e.target.value)}
          >
            {Object.keys(languageList).map((key, index) => {
              const language = languageList[key];
              return (
                <option key={index} value={key}>
                  {language.name}
                </option>
              );
            })}
          </select>
          <svg
            className="reverseSvg"
            onClick={handleReverseLanguage}
            focusable="false"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z"></path>
          </svg>
          <select
            value={outputFormat}
            onChange={(e) => {
              setOutputFormat(e.target.value);
              setTranslatedText("Translation");
            }}
          >
            {Object.keys(languageList).map((key, index) => {
              const language = languageList[key];
              return (
                <option key={index + 118} value={key}>
                  {language.name}
                </option>
              );
            })}
          </select>
        </div>
        <div className="row2">
          <div className="inputText">
            <svg
              className="removeInput"
              style={{ display: inputText.length ? "block" : "none" }}
              onClick={handleRemoveInputText}
              focusable="false"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 20 24 24"
              width="80"
              height="80"
            >
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
            </svg>
            <textarea
              type="text"
              value={inputText}
              placeholder="Enter Text"
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>
          <div className="outputText">
            <p className="outputLang">{translatedText}</p>
            {outputFormat == "en" ? (
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Speaker_Icon.svg/500px-Speaker_Icon.svg.png"
                loading="lazy"
                className="mic"
                alt="Mic"
                height={20}
                width={20}
                onClick={textSpeech}
              />
            ) : (
              ""
            )}
            <img src="https://uxwing.com/wp-content/themes/uxwing/download/file-and-folder-type/copy-file-icon.png" alt="Copy" 
                height={18}
                className="copy"
                width={18}
                onClick={copyText}
                />
          </div>
        </div>
        <div className="row3">
          {loading == true ? (
            <LoaderButton onButtonClick={handleTranslate}></LoaderButton>
          ) : (
            <TranslateButton onButtonClick={handleTranslate}></TranslateButton>
          )}
        </div>
        <ToastContainer />
      </div>
    </>
  );
}
