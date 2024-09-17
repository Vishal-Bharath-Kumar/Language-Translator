import languageList from '../constants/Language.json';

const LanguageSelector = (selectedLang, onLangChange) => {
  return (
    <>
    <select value={selectedLang} onChange={onLangChange}>
        {Object.keys(languageList).map((key, index) => {
            const language = languageList[key];
            return (
                <option key={index} value={key}>{language.name}</option>
            );
        })}
    </select>
    </>
  )
}

export default LanguageSelector