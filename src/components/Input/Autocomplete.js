import './Autocomplete.css'
import React, {useEffect, useState} from "react";

function Autocomplete({id, autocompleteSource, autoCompleteLayout, autoFocus, onChange, placeholder}) {

    const [layoutItems, setLayoutItems] = useState([]);
    const [autocompleteValue, setAutocompleteValue] = useState('');

    let typingTimeout = null;

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
            onChange(item, setAutocompleteValue);
        }
    }

    function innerOnChange(event) {
        let value = event.target.value;
        setAutocompleteValue(value);

        if (typingTimeout) {
            clearTimeout(typingTimeout)
        }
        typingTimeout = setTimeout(async () => {
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
        }, 700)
    }

    return (
        <div className={"autocomplete"}>
            <input type={"text"}
                   id={id}
                   name={id}
                   value={autocompleteValue}
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