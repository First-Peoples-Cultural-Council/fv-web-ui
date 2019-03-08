/*
Copyright 2016 First People's Cultural Council

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import selectn from 'selectn';

export default {
    // Get properties from form value
    getProperties: function (form) {
        let properties = {};
        let formValue = form.getValue();

        for (let key in formValue) {
            // Treat valued checkboxes differently. Always have value, so skip if unchecked.
            // getComponent does not work with input names that have '.' in them. Access directly.
            // valuedCheckbox = selectn('form.refs.input.refs[\'' + key + '\'].refs.valued_checkbox', form);

            let valuedCheckbox = null;

            // Ensure Input for Form Ref is defined
            if (form.refs.input) {
                valuedCheckbox = form.refs.input.refs[key].refs.valued_checkbox;
            }

            if (valuedCheckbox) {
                if (!valuedCheckbox.checked) {
                    continue;
                }
            }

            if (formValue.hasOwnProperty(key) && key) {
                if (formValue[key] && formValue[key] != '') {
                    properties[key] = formValue[key];
                }
            }
        }

        return properties;
    },
    prepareFilters: function (filters, options, optionsKey) {

        let preparedFilters = {};

        // Test each of the filters against item
        for (let filterKey in filters) {
            let filterOptions = selectn([optionsKey, 'fields', filterKey], options);

            // Add options to returned filter object

            // Filter not prepared
            if (!filters[filterKey].hasOwnProperty('appliedFilter')) {
                preparedFilters[filterKey] = {
                    appliedFilter: filters[filterKey],
                    filterOptions: filterOptions
                }
            } else {
                preparedFilters[filterKey] = filters[filterKey];
            }
        }

        return preparedFilters;
    }
}