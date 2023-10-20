import './Autocomplete.css'
import React, {useEffect, useState} from "react";

function Autocomplete({id, autocompleteSource, autoCompleteLayout, onChange}) {

    const [layoutItems, setLayoutItems] = useState([]);

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
            onChange(item);
        }
    }

    function innerOnChange(event) {
        if (typingTimeout) {
            clearTimeout(typingTimeout)
        }
        typingTimeout = setTimeout(async () => {
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
        }, 700)
    }

    return (
        <div className={"autocomplete"}>
            <input type={"text"}
                   id={id}
                   name={id}
                   autoComplete={"off"}
                   autoFocus={true}
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