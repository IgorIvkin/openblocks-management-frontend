import './SelectBox.css'
import React, {useEffect, useState, useRef} from "react";

function SelectBox({values, selectedKey, name, onChange, autoFocus}) {

    const [currentSelectedKey, setCurrentSelectedKey] = useState(selectedKey);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setCurrentSelectedKey(selectedKey);
    }, [selectedKey]);

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

    function onSelectBoxClick() {
        if (isOpen) {
            setIsOpen(false);
        } else {
            setIsOpen(true);
        }
    }

    function onOptionClick(event) {
        let key = event.target.dataset.optionKey
        if (key) {
            setIsOpen(false);
            setCurrentSelectedKey(key);
            if (onChange) {
                onChange(key)
            }
        }
    }

    function renderValues() {
        let options = [];
        for (const [key, value] of Object.entries(values)) {
            options.push(
                <div className={"select-box-item"}
                     onClick={onOptionClick}
                     key={key}
                     data-option-key={key}>{value}</div>
            )
        }
        return (
            options
        );
    }

    function getSelectedValue() {
        if (currentSelectedKey) {
            return values[currentSelectedKey];
        } else {
            return values[0]
        }
    }

    function getSelectBoxOpenClass() {
        if (isOpen) {
            return "select-box-open";
        } else {
            return "";
        }
    }

    const wrapperRef = useRef(null);
    useOutsideAutoCloseable(wrapperRef);

    return (
        <div className={"select-box " + getSelectBoxOpenClass()}
             onClick={onSelectBoxClick}
             ref={wrapperRef}>
            <input type={"hidden"}
                   name={name}
                   id={name}
                   value={currentSelectedKey} />
            <div className={"select-box-layout"}>
                <div className={"select-box-value"}>
                    {getSelectedValue()}
                </div>
                <div className={"select-box-arrow"}>
                    <svg width="20px"
                         height="20px"
                         viewBox="0 0 1024 1024"
                         className="icon"
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

export default SelectBox;