import * as React from 'react';
import * as joint from '../../rappid/rappid.min'
import * as _ from 'lodash';
import * as $ from 'jquery'
import * as config from '../config/';


import { ThemePicker } from './theme-picker';

import '../../models/joint.shapes.app'


import './main.less'
import './modern.less'
import './material.less'
import './dark.less'

export interface MainProps {
}




export default class Main extends React.Component<MainProps, any> {


  // Conatiner
  paperContainer: HTMLDivElement
  stencilContainer: HTMLDivElement
  inspectorContainer: HTMLDivElement
  navigatorContainer: HTMLDivElement
  toolbarContainer: HTMLDivElement
  appContainer: HTMLDivElement

  // rappid things
  graph: joint.dia.Graph;
  commandManager: joint.dia.CommandManager;
  paper: joint.dia.Paper;
  snaplines: joint.ui.Snaplines;
  paperScroller: joint.ui.PaperScroller;
  stencil: joint.ui.Stencil;
  keyboard: joint.ui.Keyboard;
  clipboard: joint.ui.Clipboard;
  selection: joint.ui.Selection;
  toolbar: joint.ui.Toolbar;
  navigator: joint.ui.Navigator;

  constructor(props: MainProps) {
    super(props);

    this.state = {
      theme: 'modern',
    }
  }

  initializePaper() {

    const graph = this.graph = new joint.dia.Graph;

    graph.on('add', (cell: joint.dia.Cell, collection: any, opt: any) => {
      if (opt.stencil) this.createInspector(cell);
    });

    this.commandManager = new joint.dia.CommandManager({ graph: graph });

    const paper = this.paper = new joint.dia.Paper({
      width: 1000,
      height: 1000,
      gridSize: 10,
      drawGrid: true,
      model: graph,
      defaultLink: new joint.shapes.app.Link()
    });

    // paper.on('blank:mousewheel', _.partial(this.onMousewheel, null), this);
    // paper.on('cell:mousewheel', this.onMousewheel.bind(this));

    this.snaplines = new joint.ui.Snaplines({ paper: paper });

    const paperScroller = this.paperScroller = new joint.ui.PaperScroller({
      paper,
      autoResizePaper: true,
      cursor: 'grab'
    });

    $(this.paperContainer).append(paperScroller.el);

    paperScroller.render().center();
  }

  initializeToolbar() {

    const toolbar = this.toolbar = new joint.ui.Toolbar({
      groups: config.toolbar.groups,
      tools: config.toolbar.tools,
      references: {
        paperScroller: this.paperScroller,
        commandManager: this.commandManager
      }
    });

    toolbar.on({
      'svg:pointerclick': () => this.openAsSVG(),
      'png:pointerclick': () => this.openAsPNG(),
      'to-front:pointerclick': () => this.selection.collection.invoke('toFront'),
      'to-back:pointerclick': () => this.selection.collection.invoke('toBack'),
      'layout:pointerclick': () => this.layoutDirectedGraph(),
      'snapline:change': (checked: boolean) => this.changeSnapLines(checked),
      'clear:pointerclick': () => this.graph.clear(),
      'print:pointerclick': () => this.paper.print(),
      'grid-size:change': (size: number) => this.paper.setGridSize(size)
    });

    $(this.toolbarContainer).append(toolbar.el);
    toolbar.render();
  }

  initializeStencil() {

    const stencil = this.stencil = new joint.ui.Stencil({
      paper: this.paperScroller,
      snaplines: this.snaplines,
      scaleClones: true,
      width: 240,
      groups: config.stencil.groups,
      dropAnimation: true,
      groupsToggleButtons: true,
      search: {
        '*': ['type', 'attrs/text/text', 'attrs/.label/text'],
        'org.Member': ['attrs/.rank/text', 'attrs/.name/text']
      },
      // Use default Grid Layout
      layout: true,
      // Remove tooltip definition from clone
      dragStartClone: (cell: joint.dia.Cell) => cell.clone().removeAttr('./data-tooltip')
    });

    $(this.stencilContainer).append(stencil.el);
    stencil.render().load(config.stencil.shapes);
  }


  initializeKeyboardShortcuts() {

    this.keyboard = new joint.ui.Keyboard();
    this.keyboard.on({

      'ctrl+c': () => {

        // Copy all selected elements and their associated links.
        this.clipboard.copyElements(this.selection.collection, this.graph);
      },

      'ctrl+v': () => {

        const pastedCells = this.clipboard.pasteCells(this.graph, {
          translate: { dx: 20, dy: 20 },
          useLocalStorage: true
        });

        const elements = _.filter(pastedCells, cell => cell.isElement());

        // Make sure pasted elements get selected immediately. This makes the UX better as
        // the user can immediately manipulate the pasted elements.
        this.selection.collection.reset(elements);
      },

      'ctrl+x shift+delete': () => {
        this.clipboard.cutElements(this.selection.collection, this.graph);
      },

      'delete backspace': (evt: JQuery.Event) => {
        evt.preventDefault();
        this.graph.removeCells(this.selection.collection.toArray());
      },

      'ctrl+z': () => {
        this.commandManager.undo();
        this.selection.cancelSelection();
      },

      'ctrl+y': () => {
        this.commandManager.redo();
        this.selection.cancelSelection();
      },

      'ctrl+a': () => {
        this.selection.collection.reset(this.graph.getElements());
      },

      'ctrl+plus': (evt: JQuery.Event) => {
        evt.preventDefault();
        this.paperScroller.zoom(0.2, { max: 5, grid: 0.2 });
      },

      'ctrl+minus': (evt: JQuery.Event) => {
        evt.preventDefault();
        this.paperScroller.zoom(-0.2, { min: 0.2, grid: 0.2 });
      },

      'keydown:shift': (evt: JQuery.Event) => {
        this.paperScroller.setCursor('crosshair');
      },

      'keyup:shift': () => {
        this.paperScroller.setCursor('grab');
      }
    });
  }

  initializeSelection() {

    this.clipboard = new joint.ui.Clipboard();
    this.selection = new joint.ui.Selection({
      paper: this.paper,
      handles: config.selection.handles
    });

    // Initiate selecting when the user grabs the blank area of the paper while the Shift key is pressed.
    // Otherwise, initiate paper pan.
    this.paper.on('blank:pointerdown', (evt: JQuery.Event, x: number, y: number) => {

      if (this.keyboard.isActive('shift', evt)) {
        this.selection.startSelecting(evt);
      } else {
        this.selection.cancelSelection();
        this.paperScroller.startPanning(evt);
      }

    });

    this.paper.on('element:pointerdown', (elementView: joint.dia.ElementView, evt: JQuery.Event) => {

      // Select an element if CTRL/Meta key is pressed while the element is clicked.
      if (this.keyboard.isActive('ctrl meta', evt)) {
        this.selection.collection.add(elementView.model);
      }

    });

    this.selection.on('selection-box:pointerdown', (elementView: joint.dia.ElementView, evt: JQuery.Event) => {

      // Unselect an element if the CTRL/Meta key is pressed while a selected element is clicked.
      if (this.keyboard.isActive('ctrl meta', evt)) {
        this.selection.collection.remove(elementView.model);
      }

    });
  }

  createInspector(cell: joint.dia.Cell) {

    return joint.ui.Inspector.create('.inspector-container', _.extend({ cell }, config.inspector[cell.get('type')]));
  }


  initializeHaloAndInspector() {

    this.paper.on('element:pointerup link:options', (cellView: joint.dia.CellView) => {

      const cell = cellView.model;

      if (!this.selection.collection.contains(cell)) {

        if (cell.isElement()) {

          new joint.ui.FreeTransform({
            cellView,
            allowRotation: false,
            preserveAspectRatio: !!cell.get('preserveAspectRatio'),
            allowOrthogonalResize: cell.get('allowOrthogonalResize') !== false
          }).render();

          new joint.ui.Halo({
            cellView,
            handles: config.halo.handles
          }).render();

          this.selection.collection.reset([]);
          this.selection.collection.add(cell, { silent: true });
        }

        this.createInspector(cell);
      }
    });
  }

  initializeNavigator() {

    const navigator = this.navigator = new joint.ui.Navigator({
      width: 240,
      height: 115,
      paperScroller: this.paperScroller,
      zoom: false
    });

    $(this.navigatorContainer).append(navigator.el);
    navigator.render();
  }

  initializeTooltips() {

    new joint.ui.Tooltip({
      rootTarget: document.body,
      target: '[data-tooltip]',
      direction: joint.ui.Tooltip.TooltipArrowPosition.Auto,
      padding: 10
    });
  }

  changeSnapLines(checked: boolean) {

    if (checked) {
      this.snaplines.startListening();
      this.stencil.options.snaplines = this.snaplines;
    } else {
      this.snaplines.stopListening();
      this.stencil.options.snaplines = null;
    }
  }

  openAsSVG() {

    this.paper.toSVG((svg: string) => {
      new joint.ui.Lightbox({
        title: '(Right-click, and use "Save As" to save the diagram in SVG format)',
        image: 'data:image/svg+xml,' + encodeURIComponent(svg)
      }).open();
    }, { preserveDimensions: true, convertImagesToDataUris: true });
  }

  openAsPNG() {

    this.paper.toPNG((dataURL: string) => {
      new joint.ui.Lightbox({
        title: '(Right-click, and use "Save As" to save the diagram in PNG format)',
        image: dataURL
      }).open();
    }, { padding: 10 });
  }

  onMousewheel(cellView: joint.dia.CellView, evt: JQuery.Event, ox: number, oy: number, delta: number) {

    if (this.keyboard.isActive('alt', evt)) {
      evt.preventDefault();
      this.paperScroller.zoom(delta * 0.2, { min: 0.2, max: 5, grid: 0.2, ox, oy });
    }
  }

  layoutDirectedGraph() {

    joint.layout.DirectedGraph.layout(this.graph, {
      setVertices: true,
      rankDir: 'TB',
      marginX: 100,
      marginY: 100
    });

    this.paperScroller.centerContent();
  }

  initializeThemePicker() {
    const themePicker = new ThemePicker({
      mainView: this, cb: (theme: string) => {
        this.setState({
          theme: theme
        });
      }
    });
    themePicker.render().$el.appendTo(this.appContainer);
  }

  componentDidMount() {
    this.initializePaper();
    this.initializeStencil();
    this.initializeSelection();

    this.initializeHaloAndInspector();
    this.initializeNavigator();
    this.initializeToolbar();
    this.initializeKeyboardShortcuts();
    this.initializeTooltips();



    joint.setTheme(this.state.theme);

    this.initializeThemePicker();
  }
  render() {
    let cls = `bpm-app joint-theme-${this.state.theme}`
    return (
      <div className={cls} ref={(node) => { this.appContainer = node }}>
        <div className="app-header">
          <div className="app-title">
            <h1>bpm</h1>
          </div>
          <div className="toolbar-container" ref={(node) => { this.toolbarContainer = node }}></div>
        </div>
        <div className="app-body">
          <div className="stencil-container" ref={(node) => { this.stencilContainer = node }}></div>
          <div className="paper-container" ref={(node) => { this.paperContainer = node }} ></div>
          <div className="inspector-container" ref={(node) => { this.inspectorContainer = node }}></div>
          <div className="navigator-container" ref={(node) => { this.navigatorContainer = node }}></div>
        </div>
      </div >
    );
  }
}
