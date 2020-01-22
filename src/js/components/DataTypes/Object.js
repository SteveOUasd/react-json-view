import React from "react";

import {toType} from './../../helpers/util';
import {
    JsonBoolean, JsonFloat, JsonFunction, JsonInteger,
    JsonNan, JsonNull, JsonObject, JsonString
} from './DataTypes';
import VariableMeta from './../VariableMeta';

//attribute store
import AttributeStore from './../../stores/ObjectAttributes';

//icons
import CirclePlus from 'react-icons/lib/md/add-circle-outline';
import CircleMinus from 'react-icons/lib/md/remove-circle-outline';

//increment 1 with each nested object & array
const DEPTH_INCREMENT = 1

export default class extends React.Component {

    constructor(props) {
        super(props);

        this.state.expanded = AttributeStore.get(
            this.state.state_key,
            'expanded',
            !this.props.collapsed
        );
    }

    state = {
        state_key: this.props.namespace.join('.'),
        namespace: this.props.namespace,
        indentWidth: this.props.indentWidth,
        expanded: null, //set in constructor
        object_type: (this.props.type == 'array' ? 'array' : 'object'),
        display_name: (this.props.name ? this.props.name : '')
    }

    renderPush = (depth) => {
        let {indentWidth} = this.state;
        let elements = [];

        for (let indent = 0; indent < indentWidth; indent++) {
            elements.push(<div key={indent} class="indent"/>);
        }

        return elements;
    }

    toggleCollapsed = () => {
        this.state.expanded = !this.state.expanded;
        AttributeStore.set(
            this.state.state_key,
            'expanded',
            this.state.expanded
        );
        this.setState(this.state);
    }

    getObjectContent = (depth, src, props) => {
        return (<div class="pushed-content object-container">
            <div class="push">{this.renderPush(depth)}</div>
            <div class="object-content">
                {this.renderObjectConents(src, props)}
            </div>
        </div>);
    }

    getElipsis = () => {
        return (
            <div class="collapsed-elipsis" onClick={this.toggleCollapsed}>
                ...
            </div>
        );
    }

    getObjectMetaData = (src) => {
        const size = Object.keys(src).length;
        return (
            <VariableMeta size={size} src={src} />
        );
    }

    render = () => {
        // `indentWidth` and `collapsed` props will
        // perpetuate to children via `...rest`
        const {
            depth, src, namespace, name, type, ...rest
        } = this.props;
        const {
            object_type, display_name, expanded
        } = this.state;
        const expanded_class = expanded ? "expanded" : "collapsed";
        const expanded_icon = expanded ? <CircleMinus /> : <CirclePlus />;

        return (<div class="object-key-val">
            <div onClick={this.toggleCollapsed} class="open-brace brace-row">
                <div class={"icon-container " + expanded_class}>
                    {expanded_icon /*mdi icon*/}
                </div>
                <div class="object-name">{display_name}</div>
                <div class="object-colon">:</div>
                <div class="brace">{object_type == 'array' ? '[' : '{'}</div>
                {expanded ? this.getObjectMetaData(src) : null}
            </div>
            {expanded
                ? this.getObjectContent(depth, src, rest)
                : this.getElipsis()
            }
            <div class="close-brace brace-row">
                <div class="brace">{object_type == 'array' ? ']' : '}'}</div>
                {expanded ? null : this.getObjectMetaData(src)}
            </div>
        </div>);
    }

    renderObjectConents = (variables, props) => {
        const {depth} = this.props;
        const {namespace, object_type} = this.state;
        let elements = [], variable;

        for (let name in variables) {
            variable = new JsonVariable(name, variables[name]);
            if (variable.type == 'object') {
                elements.push(
                    <JsonObject key={variable.name}
                        depth={depth + DEPTH_INCREMENT}
                        name={variable.name}
                        src={variable.value}
                        namespace={namespace.concat(variable.name)}
                        {...props}
                    />);
            } else if (variable.type == 'array') {
                elements.push(
                    <JsonObject key={variable.name}
                        depth={depth + DEPTH_INCREMENT}
                        name={variable.name}
                        src={variable.value}
                        namespace={namespace.concat(variable.name)}
                        type="array"
                        {...props}
                    />);
            } else {
                elements.push(<div class="object-key-val" key={variable.name}>
                    <div class={"object-key " + object_type}>
                            {variable.name}
                        <div class="key-colon">:</div>
                    </div>
                    {getValue(variable)}
                </div>);
            }
        }
        return elements;

        function getValue(variable) {
            switch (variable.type) {
                case 'string':
                    return <JsonString value={variable.value} />;
                case 'integer':
                    return <JsonInteger value={variable.value} />;
                case 'float':
                    return <JsonFloat value={variable.value} />;
                case 'boolean':
                    return <JsonBoolean value={variable.value} />;
                case 'function':
                    return <JsonFunction value={variable.value} />;
                case 'null':
                    return <JsonNull />;
                case 'nan':
                    return <JsonNan />;
                default:
                    //catch-all for types that weren't anticipated
                    return <div class="object-value">{variable.value}</div>;
            }
        }
    }
}

//just store name, value and type with a variable
class JsonVariable {
    constructor(name, value) {
        this.name = name;
        this.value = value;
        this.type = toType(value);
    }
}