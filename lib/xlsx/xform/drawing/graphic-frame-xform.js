const BaseXform = require('../base-xform');
const StaticXform = require('../static-xform');
const GraphicXform = require('./graphic-xform');
const NvGraphicFramePrXform = require('./nv-graphic-frame-pr.xform');

class GraphicFrameXform extends BaseXform {
  constructor() {
    super();

    this.map = {
      'xdr:nvGraphicFramePr': new NvGraphicFramePrXform(),
      'a:graphic': new GraphicXform(),
      'xdr:xfrm': new StaticXform({
        tag: 'xdr:xfrm',
        c: [
          {tag: 'a:off', $: {x: '0', y: '0'}},
          {tag: 'a:ext', $: {cx: '0', cy: '0'}},
        ],
      }),
    };
  }

  get tag() {
    return 'xdr:graphicFrame';
  }

  render(xmlStream, model) {
    xmlStream.openNode(this.tag, {macro: model.macro});

    this.map['xdr:nvGraphicFramePr'].render(xmlStream, model.graphicFrame);
    this.map['xdr:xfrm'].render(xmlStream, model);
    this.map['a:graphic'].render(xmlStream, model.graphic);

    xmlStream.closeNode();
  }

  parseOpen(node) {
    if (this.parser) {
      this.parser.parseOpen(node);
      return true;
    }
    switch (node.name) {
      case this.tag:
        this.reset();
        this.model = {
          macro: node.attributes.macro || '',
        };
        break;
      default:
        this.parser = this.map[node.name];
        if (this.parser) {
          this.parser.parseOpen(node);
        }
        break;
    }
    return true;
  }

  parseText() {}

  parseClose(name) {
    if (this.parser) {
      if (!this.parser.parseClose(name)) {
        // this.mergeModel(this.parser.model);
        this.parser = undefined;
      }
      return true;
    }
    switch (name) {
      case this.tag:
        this.model.graphic = this.map['a:graphic'].model;
        this.model.graphicFrame = this.map['xdr:nvGraphicFramePr'].model;
        return false;
      default:
        // not quite sure how we get here!
        return true;
    }
  }
}

module.exports = GraphicFrameXform;
