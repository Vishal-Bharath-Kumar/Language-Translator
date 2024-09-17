import PropTypes from 'prop-types';

// eslint-disable-next-line react/prop-types
const TranslateButton = ({onButtonClick}) => {
  return (
    <div>
      <button      
        type="button"
        onClick={onButtonClick}
        className="translateButton"
      >
        Translate
      </button>
    </div>
  )
}
TranslateButton.prototype ={
    onButtonClick: PropTypes.func.isRequired,
}

export default TranslateButton