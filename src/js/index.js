import React from 'react';
import JsonViewer from './components/JsonViewer';
import {toType, isTheme} from './helpers/util';
import ObjectAttributes from './stores/ObjectAttributes';

import deepcopy from 'deepcopy';

//global theme
import style from './themes/getStyle';


//forward src through to JsonObject component
export default class extends React.Component {

    constructor(props) {
        super(props);
        this.init(props);
    }

    state = {}

    //reference id for this instance
    rjvId = Date.now().toString()

    //all acceptable props and default values
    defaults = {
        src: {},
        name: 'root',
        theme: 'rjv-default',
        collapsed: false,
        collapseStringsAfterLength: false,
        indentWidth: 4,
        enableClipboard: true,
        displayObjectSize: true,
        displayDataTypes: true,
        onEdit: false,
        onDelete: false
    }

    componentWillMount() {
        ObjectAttributes.on(
            'variable-update-' + this.rjvId, this.updateSrc
        );
    }

    componentWillUnmount() {
        ObjectAttributes.removeListener(
            'variable-update-' + this.rjvId, this.updateSrc
        );
    }

    init = (props) => {
        for (let i in this.defaults) {
            if (props[i] !== undefined) {
                this.state[i] = props[i];
            } else {
                this.state[i] = this.defaults[i];
            }
        }

        this.validateInput();
    }

    //make sure props are passed in as expected
    validateInput = () => {
        //make sure theme is valid
        if (toType(this.state.theme) === 'object'
            && !isTheme(this.state.theme)
        ) {
            console.error(
                'react-json-view error:',
                'theme prop must be a theme name or valid base-16 theme object.',
                'defaulting to "rjv-default" theme'
            );
            this.state.theme = 'rjv-default';
        }

        //make sure `src` prop is valid
        if (toType(this.state.src) !== 'object'
            && toType(this.state.src) !== 'array'
        ) {
            console.error(
                'react-json-view error:',
                'src property must be a valid json object'
            );
            this.state.name = 'ERROR';
            this.state.src = {
                message: 'src property must be a valid json object'
            }
        }

        //make sure `onEdit` prop is a function when not `false`
        if (this.state.onEdit !== false
            && toType(this.state.onEdit) !== 'function'
        ) {
            this.state.onEdit = ()=>{};
            console.error(
                'react-json-view error:',
                'onEdit property must be a function when enabled'
            );
        }
    }

    render() {
        const {...props} = this.state;
        return (<div class="react-json-view"
            {...style(props.theme, 'app-container')} >
            <JsonViewer {...props} type={toType(props.src)} rjvId={this.rjvId} />
        </div>);
    }

    componentWillReceiveProps(nextProps) {
        this.init(nextProps);
        this.setState(this.state);
    }

    updateSrc = () => {
        let {
            name, namespace, new_value, existing_value, variable_removed
        } = ObjectAttributes.get(
            this.rjvId, 'action', 'variable-update'
        );
        let {onEdit} = this.state;
        let src;
        namespace.shift();

        const getUpdatedSrc = () => {
            //deepy copy src
            let updated_src = deepcopy(this.state.src);
            let walk = updated_src;
            for (const idx of namespace) {
                walk = walk[idx];
            }
            if (variable_removed) {
                if (toType(walk) == 'array') {
                    walk.splice(name, 1);
                } else {
                    delete walk[name];
                }
            } else {
                walk[name] = new_value;
            }

            return updated_src;
        }

        src = getUpdatedSrc();

        const on_edit_payload = {
            existing_src: this.state.src,
            updated_src: src,
            name: name,
            namespace: namespace,
            existing_value: existing_value,
        }
        if (!variable_removed) {
            on_edit_payload['new_value'] = new_value;
        }

        if (onEdit(on_edit_payload) !== false) {
            this.state.src = src;
            this.setState(this.state);
        }
    }
}
