import 'js-datepicker/dist/datepicker.min.css';
import './Datepicker.css';
import React, {useEffect} from "react";
import datepicker from 'js-datepicker';

function Datepicker({id, rangeId, selectedDate, disabledBy, onChange, autoFocus, autoOpen,
                        placeholder, additionalClasses}) {

    let picker = null;

    function getIsoDate(dateStr) {
        if (dateStr && dateStr !== "-") {
            return new Date(dateStr);
        }
        return null;
    }

    useEffect(() => {
        if (!picker) {
            picker = datepicker("#" + id, {
                onSelect: instance => {
                    if (onChange) {
                        onChange(instance.dateSelected);
                    }
                },
                disabler: disabledBy,
                disableYearOverlay: true,
                dateSelected: getIsoDate(selectedDate),
                formatter: (input, date, instance) => {
                    input.value = date.toLocaleDateString()
                },
                startDay: 1,
                customDays: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
                customMonths: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
                id: rangeId ? rangeId : 1
            });
            if (autoOpen) {
                picker.show();
            }
        }
    }, []);

    return (
        <input type={"text"}
               autoComplete={"off"}
               className={additionalClasses ? additionalClasses : ''}
               placeholder={placeholder}
               autoFocus={autoFocus ? autoFocus : false}
               id={id}></input>
    );
}

export default Datepicker;