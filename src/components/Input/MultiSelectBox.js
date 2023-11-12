import './SelectBox.css'
import React, {useEffect, useState, useRef} from "react";

function MultiSelectBox({values, placeHolder, onChange, autoFocus, overflow, classes}) {

    const [currentSelectedKeys, setCurrentSelectedKeys] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (autoFocus) {
            setIsOpen(true)
        } else {
            setIsOpen(false);
        }
    }, [false]);

    function useOutsideAutoCloseable(ref) {
        useEffect(() => {

            function handleClickOutside(event) {
                if (ref.current && !ref.current.contains(event.target)) {
                    setIsOpen(false);
                }
            }

            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [ref]);
    }

    function onSelectBoxClick(event) {
        let targetClasses = event.target.classList;
        if (isOpen) {
            if (targetClasses.contains('multiselect-box-closeable-area')) {
                setIsOpen(false);
            }
        } else {
            setIsOpen(true);
        }
    }

    function cloneArray(array) {
        let newArray = [];
        if (array) {
            for (let e of array) {
                newArray.push(e);
            }
        }
        return newArray;
    }

    function onOptionClick(event, key) {
        if (key) {
            let keys = cloneArray(currentSelectedKeys);
            if (keys.includes(key)) {
                keys = keys.filter(e => e !== key);
            } else {
                keys = keys.concat([key]);
            }
            setCurrentSelectedKeys(keys);

            if (onChange) {
                onChange(keys);
            }
        }
    }

    function renderValues() {
        let options = [];
        for (const [key, value] of Object.entries(values)) {
            options.push(
                <div className={"select-box-item select-box-multiselect-item"}
                     onClick={(event) => {
                         onOptionClick(event, key);
                     }}
                     key={key}
                     data-option-key={key}>
                    <span className={"select-box-multiselect-check "
                        + (currentSelectedKeys.includes(key) ? "select-box-multiselect-check-selected" : "")}>
                        <span className={"select-box-checkmark"}></span>
                    </span>
                    <span className={"select-box-multiselect-value"}>{value}</span>
                </div>
            )
        }
        return (
            options
        );
    }

    function getSelectedValues() {
        if (currentSelectedKeys.length > 0) {
            let result = '';
            for (let key of currentSelectedKeys) {
                if (values[key]) {
                    if (result !== '') {
                        result += ', ' + values[key];
                    } else {
                        result = values[key];
                    }
                }
            }
            return result;
        } else {
            return placeHolder;
        }
    }

    function getSelectBoxOpenClass() {
        if (isOpen) {
            return "select-box-open";
        } else {
            return "";
        }
    }

    function getAdditionalClasses() {
        return classes;
    }

    function getOverflowClass() {
        if (overflow) {
            return "select-box-value-overflow";
        }
    }

    const wrapperRef = useRef(null);
    useOutsideAutoCloseable(wrapperRef);

    return (
        <div className={"select-box " + getSelectBoxOpenClass() + " " + getAdditionalClasses()}
             onClick={onSelectBoxClick}
             ref={wrapperRef}>
            <div className={"select-box-layout"}>
                <div className={"select-box-value multiselect-box-closeable-area " + getOverflowClass()}>
                    {getSelectedValues()}
                </div>
                <div className={"select-box-arrow multiselect-box-closeable-area"}>
                    <svg width="20px"
                         height="20px"
                         viewBox="0 0 1024 1024"
                         className="icon multiselect-box-closeable-area"
                         version="1.1"
                         xmlns="http://www.w3.org/2000/svg">
                        <path d="M903.232 256l56.768 50.432L512 768 64 306.432 120.768 256 512 659.072z" />
                    </svg>
                </div>
            </div>
            <div className={"select-box-options"}>
                {renderValues()}
            </div>
        </div>
    );
}

export default MultiSelectBox;