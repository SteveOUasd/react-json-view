"use strict";

//import react and reactDom for browser rendering
import React from "react";
import ReactDom from "react-dom";

//import the react-json-view component (installed with npm)
import JsonViewer from './../src/js/index';

//render 2 different examples of the react-json-view component
ReactDom.render(
    <div>
        {/* just pass in your JSON to the src attribute */}
        <JsonViewer
        style={{padding:'30px', backgroundColor: 'white'}}
        src={getExampleJson1()}
        collapseStringsAfterLength={12}
        onEdit={(e)=>{console.log(e); if (e.new_value == 'error'){return false;}}}
        onDelete={(e)=>{console.log(e);}}
        onAdd={(e)=>{console.log(e); if (e.new_value == 'error'){return false;}}}
        displayObjectSize={false}
        enableClipboard={true} />

        <br />

        {/* use a base16 theme */}
        <JsonViewer
        src={getExampleJson1()}
        theme='railscasts'
        collapseStringsAfterLength={15}
        onEdit={(e)=>{console.log(e); if (e.new_value == 'error'){return false;}}}
        onDelete={(e)=>{console.log(e);}}
        onAdd={(e)=>{console.log(e); if (e.new_value == 'error'){return false;}}}
        name={false} />

        <br />

        {/* initialize this one with a name and default collapsed */}
        <JsonViewer
        src={getExampleJson2()}
        collapsed={true}
        name={'feature_set'}
        displayDataTypes={false}
        indentWidth={2}
        />

        <br />

        {/* initialize this one with a name and default collapsed */}
        <JsonViewer
        src={getExampleJson2()}
        collapsed={1}
        name={'feature_set'}
        displayDataTypes={false}
        indentWidth={5}
        />

        <br />

        {/* initialize an example with a long string */}
        <JsonViewer
        src={getExampleJson3()}
        collapsed={true}
        name={'collapsed_by_default_example'}
        indentWidth={8}
        displayObjectSize={false}
        displayDataTypes={false}
        enableClipboard={false}
        />

        <br />

        {/*demo array support*/}
        <JsonViewer
        src={getExampleArray()}
        theme='solarized'
        onEdit={(edit)=>{console.log(edit)}} />

        <br />

        {/* custom theme example */}
        <JsonViewer
        enableClipboard={false}
        src={getExampleJson1()}
        theme={{
          base00: 'white',
          base01: '#ddd',
          base02: '#ddd',
          base03: '#444',
          base04: 'purple',
          base05: '#444',
          base06: '#444',
          base07: '#444',
          base08: '#444',
          base09: 'rgba(70, 70, 230, 1)',
          base0A: 'rgba(70, 70, 230, 1)',
          base0B: 'rgba(70, 70, 230, 1)',
          base0C: 'rgba(70, 70, 230, 1)',
          base0D: 'rgba(70, 70, 230, 1)',
          base0E: 'rgba(70, 70, 230, 1)',
          base0F: 'rgba(70, 70, 230, 1)'
        }}
        />


    </div>,
    document.getElementById('app-container')
);

/*-------------------------------------------------------------------------*/
/*     the following functions just contain test json data for display     */
/*-------------------------------------------------------------------------*/

//just a function to get an example JSON object
function getExampleJson1() {
    Array.prototype.containsKey = function(obj) {
        for(var key in this)
            if (key == obj) return true;
        return false;
    }
    return {
        string: 'this is a test string',
        integer: 42,
        array: [1, 2, [1,2,3,4,5], 3, 'test'],
        float: -2.757,
        undefined_var: undefined,
        parent: {
            sibling1: true,
            sibling2: false,
            sibling3: null,
            isString: (value) => {
                if (typeof value == 'string') {
                    return 'string';
                } else {
                    return 'other';
                }
            }
        },
        string_number: "1234",
        date: new Date()
    };
}

//and another a function to get an example JSON object
function getExampleJson2() {
    return {"normalized":{
        "1-grams":{
            "body":1,
            "testing":1
        },
        "2-grams":{
            "testing body":1
        },
        "3-grams":{}
        },
        "noun_phrases":{
            "body":1
        },"lemmatized":{
            "1-grams":{
                "test":1,
                "body":1
            },"2-grams":{
                "test body":1
            },"3-grams":{}
        },"dependency":{
            "1-grams":{
                "testingVERBROOTtestingVERB":1,
                "bodyNOUNdobjtestingVERB":1
            },
            "2-grams":{
                "testingVERBROOTtestingVERB bodyNOUNdobjtestingVERB":1
            },"3-grams":{}
        }
    };
}


function getExampleJson3() {
    return {
        example_information: 'this example has the collapsed prop set to true and the indentWidth prop is set to 8',
        default_collapsed: true,
        collapsed_array: [
            'you expanded me',
            'try collapsing and expanding the root node',
            'i will still be expanded',
            {
                leaf_node: true
            }
        ]
    };
}


function getExampleArray() {
    return [
        'you can also display arrays!',
        new Date(),
        1,
        2,
        3,
        {
            'pretty_cool': true
        }
    ];
}
