import React, {Component, PropTypes} from 'react';
import ConfGlobal from 'conf/local.json';

export default class Link extends Component {

    constructor(props, context) {
        super(props, context);
    }

    render() {
        let linkedTitle;
        let link = this.props.data;
        let description;
        let showDescription = this.props.showDescription;

        // Title if the link document contains an attached file
        if (link.path) {
            linkedTitle = <a href={ConfGlobal.baseURL + link.path}>{link.title}</a>;
        }
        // Title if the link document has no attached file and points to an external link
        else {
            linkedTitle = <a href={link.url}>{link.title}</a>;
        }

        if (showDescription == true) {
            description = <p>{link.description}</p>;
        }

        return (
            <div key={link.uid}>
                {linkedTitle}
                {description}
            </div>
        );
    }
}