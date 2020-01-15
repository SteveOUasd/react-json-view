import React from "react";
import {toType} from './../helpers/util';
import JsonObject from './JsonObject';

const DEPTH_OFFSET = 1

export default class extends React.Component {
    constructor(props) {
        super(props);
    }

    render = () => {
        const {depth, src} = this.props; 
        return (<div>
            <div class="open brace">{'{'}</div>
            <div class="pushed-content">
                <div class="push">{this.renderPush(depth)}</div>
                <div class="object-content">
                    {this.renderObjectConents(src)}
                </div>
            </div>
            <div class="close brace">{'}'}</div>
        </div>);
    }

    renderObjectConents = (attrs) => {
        const {depth} = this.props;
        let elements = [];

        for (let i in attrs) {
            elements.push(<div class="object-key-val" key={i}>
                <div class="object-key">{i}<div class="key-colon">:</div></div>
                {getValue(attrs[i])}
            </div>);
        }
        return elements;

        function getValue(value) {
            const type = toType(value);

            //TODO put each of these into their own components
            //eg: <PrettyString>{value}</PrettyString>
            switch (type) {
                case 'object':
                    return <JsonObject depth={depth + 1} src={value}/>

                case 'string':
                    return <div class="object-value string">
                        <span class="data-type">string</span> 
                        {value}
                    </div>;

                case 'number':
                    return <div class="object-value number">
                        <span class="data-type">number</span>
                        {value}
                    </div>;

                case 'array':
                    return <div class="object-value array">
                        <span class="data-type">array</span>
                        [{value.toString()}]
                    </div>;

                case 'boolean':
                    if (value) {
                        return <div class="object-value boolean">
                            <span class="data-type">boolean</span> 
                            True
                        </div>;

                    } else {
                        return <div class="object-value boolean">
                            <span class="data-type">boolean</span> 
                            False
                        </div>;

                    }
                case 'function':
                    return <div class="object-value function">
                        {value.toString()}
                    </div>;

                case 'null':
                    return <div class="object-value null">
                        NULL
                    </div>;

                case 'nan':
                    return <div class="object-value nan">
                        NaN
                    </div>;

                default:
                    return <div class="object-value">{value}</div>;   
            }
        }
    }

    renderPush = (depth) => {
        let elements = [];
        for (let i = 0; i < depth + DEPTH_OFFSET; i++) {
            elements.push(<div class="indent">&nbsp;</div>);
        }
    }
}