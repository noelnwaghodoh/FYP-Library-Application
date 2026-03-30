import { NODE_BASE_ESM_RESOLVE_OPTIONS } from "next/dist/build/webpack-config";

function Form({ children, onSubmit, onCancel, submitButtonText }) {
  return (
    <div className="bg-white">
      <div>{children}</div>
      <button onClick={onSubmit}>{submitButtonText}</button>
    </div>
  );
}

function Item({ children, label, advice, error }) {
  return (
    <div className="FormItem">
      <label className="FormLabel">{label}</label>
      {advice && <p className="FormAdvice">{advice}dd</p>}
      {children}
      {error && <p className="FormError">{error}</p>}
    </div>
  );
}

function useForm(
  initialRecord,
  { html2js },
  { isValid, errorMessage },
  onSubmit,
) {
  //Initialisation----------------------------
  //State----------------------------------------
  const [record, setRecord] = useState(initialRecord);
  const [errors, setErrors] = useState(
    Object.keys(isValid).reduce(
      (accum, key) => ({ ...accum, [key]: null }, {}),
    ),
  );

  const isValidRecord = (record) => {
    let isRecordValid = true;
    Object.keys(isValid).forEach((key) => {
      if (isValid[key](record[key])) {
        errors[key] = null;
      } else {
        errors[key] = errorMessage[key];
        isRecordValid = false;
      }
    });
    return isRecordValid;
  };

  //Handlers-----------------------------------------------
  const handleChange = (event) => {
    const { name, value } = event.target;
    setRecord({ ...record, [name]: html2js[name](value) });
  };

  const handleSubmit = () => {
    console.log(isValidRecord(record) + " is the validity");
    isValidRecord(record) && onSubmit(record);

    setErrors({ ...errors });
  };

  //View---------------------------------------------------------
  return [record, errors, handleChange, handleSubmit];
}

Form.Item = Item;
Form.useForm = useForm;

export default Form;
