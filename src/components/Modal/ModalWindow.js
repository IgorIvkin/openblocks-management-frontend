import './ModalWindow.css';
import React, {useState} from "react";

function ModalWindow(props) {

    let [isVisible, setIsVisible] = useState(!!props.visible);

    function onClickCancel() {
        setIsVisible(false);
        if (props.setIsDeleteModal) {
            props.setIsDeleteModal(false);
        }
        if (props.onClickCancel) {
            props.onClickCancel();
        }
    }

    function visibleClass() {
        return isVisible ? 'modal-window-visible' : '';
    }

    return (
        <div className={"modal-window-background " + visibleClass()}>
            <div className={"modal-window-layout"}>
                <div className={"modal-window"}>
                    <div className={"modal-window-header"}>{props.header}</div>
                    <div className={"modal-window-content"}>
                        {props.children}
                    </div>
                    <div className={"modal-window-buttons"}>
                        <button className={"btn-plain"}
                                onClick={onClickCancel}>Отмена</button>
                        <button className={"btn-add"}
                                onClick={props.onClickOk}>{props.okButtonLabel}</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalWindow;