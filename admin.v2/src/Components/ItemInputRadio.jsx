import PropTypes from "prop-types";

function ItemInputRadio({
  topic,
  idInput,
  nameInput,
  valueInput,
  htmlFor,
  valueInputRadioSearch,
  setValueInputRadioSearch,
}) {
  return (
    <>
      <input
        className="cursor-pointer mr-2"
        type="radio"
        id={idInput}
        name={nameInput}
        value={valueInput}
        checked={valueInputRadioSearch === idInput}
        onClick={(e) => setValueInputRadioSearch(e.target.value)}
      />
      <label className="cursor-pointer" htmlFor={htmlFor}>
        {topic}
      </label>
      <span className="mx-2">|</span>
    </>
  );
}
ItemInputRadio.propTypes = {
  topic: PropTypes.string.isRequired,
  idInput: PropTypes.string.isRequired,
  nameInput: PropTypes.string.isRequired,
  valueInput: PropTypes.string.isRequired,
  htmlFor: PropTypes.string.isRequired,
  valueInputRadioSearch: PropTypes.string.isRequired,
  setValueInputRadioSearch: PropTypes.func.isRequired,
};
export default ItemInputRadio;
