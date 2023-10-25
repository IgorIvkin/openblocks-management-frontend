import React from "react";
import Autocomplete from "../../Input/Autocomplete";
import BacklogClient from "../../../clients/BacklogClient";

function TaskAutocomplete({id, onChange}) {
    return (
        <div>
            <Autocomplete id={id}
                          onChange={onChange}
                          placeholder={"Введите код задачи"}
                          autocompleteSource={(taskCode) => {
                              return BacklogClient.getBacklog({
                                  taskCode: taskCode
                              })
                          }}
                          autoCompleteLayout={(task) => {
                              return (
                                  <div>
                                      <div>{task.subject}</div>
                                      <span className={"user-autocomplete-login"}>{task.taskCode}</span>
                                  </div>
                              );
                          }}/>
        </div>
    );
}

export default TaskAutocomplete;