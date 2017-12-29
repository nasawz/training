/*! Rappid v2.2.0 - HTML5 Diagramming Framework - TRIAL VERSION

Copyright (c) 2015 client IO

 2017-12-26 


This Source Code Form is subject to the terms of the Rappid Trial License
, v. 2.0. If a copy of the Rappid License was not distributed with this
file, You can obtain one at http://jointjs.com/license/rappid_v2.txt
 or from the Rappid archive as was distributed by client IO. See the LICENSE file.*/


import { dia, shapes } from '../rappid/rappid.min';

declare module '../rappid/rappid.min' {
    namespace shapes {
        namespace app {
            class Link extends dia.Link { }

            class CircularModel extends shapes.devs.Model { }

            class RectangularModel extends shapes.devs.Model { }
        }
    }
}

dia.Link.define('app.Link', {
    type: 'app.Link',
    router: {
        name: 'normal'
    },
    connector: {
        name: 'normal'
    },
    attrs: {
        '.tool-options': {
            'data-tooltip-class-name': 'small',
            'data-tooltip': 'Click to open Inspector for this link',
            'data-tooltip-position': 'left'
        },
        '.marker-source': {
            d: 'M 10 0 L 0 5 L 10 10 z',
            stroke: 'transparent',
            fill: '#222138',
            transform: 'scale(0.001)'
        },
        '.marker-target': {
            d: 'M 10 0 L 0 5 L 10 10 z',
            stroke: 'transparent',
            fill: '#222138',
            transform: 'scale(1)'
        },
        '.connection': {
            stroke: '#222138',
            strokeDasharray: '0',
            strokeWidth: 1,
            fill: 'none'
        },
        '.connection-wrap': {
            fill: 'none'
        }
    }
});

shapes.devs.Model.define('app.CircularModel', {
    ports: {
        groups: {
            'in': {
                markup: '<circle class="port-body" r="10"/>',
                attrs: {
                    '.port-body': {
                        fill: '#61549C',
                        strokeWidth: 0
                    },
                    '.port-label': {
                        fontSize: 11,
                        fill: '#61549C',
                        fontWeight: 800
                    }
                },
                position: {
                    name: 'ellipse',
                    args: {
                        startAngle: 0,
                        step: 30
                    }
                },
                label: {
                    position: {
                        name: 'radial',
                        args: null
                    }
                }
            },
            'out': {
                markup: '<circle class="port-body" r="10"/>',
                attrs: {
                    '.port-body': {
                        fill: '#61549C',
                        strokeWidth: 0
                    },
                    '.port-label': {
                        fontSize: 11,
                        fill: '#61549C',
                        fontWeight: 800
                    }
                },
                position: {
                    name: 'ellipse',
                    args: {
                        startAngle: 180,
                        step: 30
                    }
                },
                label: {
                    position: {
                        name: 'radial',
                        args: null
                    }
                }
            }
        }
    }
});

shapes.devs.Model.define('app.RectangularModel', {
    ports: {
        groups: {
            'in': {
                markup: '<circle class="port-body" r="10"/>',
                attrs: {
                    '.port-body': {
                        fill: '#61549C',
                        strokeWidth: 0
                    },
                    '.port-label': {
                        fontSize: 11,
                        fill: '#61549C',
                        fontWeight: 800
                    }
                },
                label: {
                    position: {
                        name: 'left',
                        args: {
                            y: 0
                        }
                    }
                }
            },
            'out': {
                markup: '<circle class="port-body" r="10"/>',
                attrs: {
                    '.port-body': {
                        fill: '#61549C',
                        strokeWidth: 0
                    },
                    '.port-label': {
                        fontSize: 11,
                        fill: '#61549C',
                        fontWeight: 800
                    }
                },
                label: {
                    position: {
                        name: 'right',
                        args: {
                            y: 0
                        }
                    }
                }
            }
        }
    }
});
