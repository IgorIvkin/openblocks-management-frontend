import './Autocomplete.css'
import React, {useRef, useState} from "react";

function Autocomplete({id, autocompleteSource, autoCompleteLayout, autoFocus, onChange, placeholder}) {

    const autoCompleteInputRef = useRef(null);

    const [layoutItems, setLayoutItems] = useState([]);

    function onBlurAutocomplete(event) {
        event.stopPropagation();
        let value = event.target.value;
        if (value === '') {
            onChange({})
        }
    }

    function onClickAutocompleteItem(item) {
        setLayoutItems([]);
        if (onChange) {
            onChange(item, autoCompleteInputRef);
        }
    }

    let typingTimeout = null;

    function innerOnChange(event) {
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(async function() {
            await innerLoadAutocomplete(event);
        }, 700);
    }

    async function innerLoadAutocomplete(event) {
        let value = event.target.value;

        if (autocompleteSource) {
            try {
                let autocompleteItems = [];
                if (value !== '') {
                    const responseItems = await autocompleteSource(value);
                    if (responseItems.data) {
                        responseItems.data.forEach((item) => {
                            autocompleteItems.push(
                                <div className={"autocomplete-layout-item"}
                                     onClick={() => {
                                         onClickAutocompleteItem(item)
                                     }}>
                                    {autoCompleteLayout(item)}
                                </div>
                            );
                        });
                    }
                }
                setLayoutItems(autocompleteItems);
            } catch (error) {
                console.log(error);
            }
        }
    }

    return (
        <div className={"autocomplete"}>
            <input type={"text"}
                   ref={autoCompleteInputRef}
                   id={id}
                   name={id}
                   autoComplete={"off"}
                   autoFocus={autoFocus ? autoFocus : false}
                   placeholder={placeholder}
                   onBlur={onBlurAutocomplete}
                   onChange={innerOnChange} />
            {layoutItems?.length > 0 &&
                <div className={"autocomplete-layout"}
                     id={"autocomplete-layout-" + id}>
                    {layoutItems.map((item, i) => {
                        return (item);
                    })}
                </div>
            }
        </div>
    );
}

export default Autocomplete;