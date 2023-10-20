import React from "react";
import Autocomplete from "../Input/Autocomplete";
import UserClient from "../../clients/UserClient";

function UserAutocomplete({id, onChange}) {
    return (
        <div>
            <Autocomplete id={id}
                          onChange={onChange}
                          autocompleteSource={(query) => {
                              return UserClient.searchUsers(query);
                          }}
                          autoCompleteLayout={(user) => {
                              return (
                                  <div>
                                      <div>{user.name}</div>
                                      <span className={"user-autocomplete-login"}>{user.login}</span>
                                  </div>
                              );
                          }}/>
        </div>
    );
}

export default UserAutocomplete;