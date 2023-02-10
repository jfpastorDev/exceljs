const BaseXform = require('../base-xform');
const StaticXform = require('../static-xform');
const CNvPrXform = require('./c-nv-pr-xform');

class NvGraphicFramePrXform extends BaseXform {
  constructor() {
    super();

    this.map = {
      'xdr:cNvPr': new CNvPrXform(),
      'xdr:cNvGraphicFramePr': new StaticXform({
        tag: 'xdr:cNvGraphicFramePr',
        c: [{tag: 'a:graphicFrameLocks'}],
      }),
    };
  }

  get tag() {
    return 'xdr:nvGraphicFramePr';
  }

  render(xmlStream, model) {
    xmlStream.openNode(this.tag);
    this.map['xdr:cNvPr'].render(xmlStream, model);
    this.map['xdr:cNvGraphicFramePr'].render(xmlStream, model);
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

  parseClose(name) {
    if (this.parser) {
      if (!this.parser.parseClose(name)) {
        this.parser = undefined;
      }
      return true;
    }
    switch (name) {
      case this.tag:
        this.model = this.map['xdr:cNvPr'].model;
        return false;
      default:
        return true;
    }
  }
}

module.exports = NvGraphicFramePrXform;
