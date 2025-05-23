const XmlStream = require('../../../utils/xml-stream');

const BaseXform = require('../base-xform');
const TwoCellAnchorXform = require('./two-cell-anchor-xform');
const OneCellAnchorXform = require('./one-cell-anchor-xform');
const CellTypes = require('./cell-types');

function getAnchorType(model) {
  // const range = typeof model.range === 'string' ? colCache.decode(model.range) : model.range;
  let type = null;
  if (model.cellType === CellTypes.ONE_CELL) {
    type = 'xdr:oneCellAnchor';
  } else if (model.cellType === CellTypes.TWO_CELL) {
    type = 'xdr:twoCellAnchor';
  }
  return type;
}

class DrawingXform extends BaseXform {
  constructor() {
    super();

    this.map = {
      'xdr:twoCellAnchor': new TwoCellAnchorXform(),
      'xdr:oneCellAnchor': new OneCellAnchorXform(),
    };
  }

  prepare(model) {
    model.anchors.forEach((item, index) => {
      const type = getAnchorType(item);
      if (type) {
        item.anchorType = type;
        const anchor = this.map[item.anchorType];
        anchor.prepare(item, {index});
      }
    });
  }

  get tag() {
    return 'xdr:wsDr';
  }

  render(xmlStream, model) {
    xmlStream.openXml(XmlStream.StdDocAttributes);
    xmlStream.openNode(this.tag, DrawingXform.DRAWING_ATTRIBUTES);

    model.anchors.forEach(item => {
      const anchor = this.map[item.anchorType];
      anchor.render(xmlStream, item);
    });

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
          anchors: [],
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

  parseText(text) {
    if (this.parser) {
      this.parser.parseText(text);
    }
  }

  parseClose(name) {
    if (this.parser) {
      if (!this.parser.parseClose(name)) {
        this.model.anchors.push(this.parser.model);
        this.parser = undefined;
      }
      return true;
    }
    switch (name) {
      case this.tag:
        return false;
      default:
        // could be some unrecognised tags
        return true;
    }
  }

  reconcile(model, options) {
    model.anchors.forEach(anchor => {
      if (anchor.cellType === CellTypes.TWO_CELL) {
        this.map['xdr:twoCellAnchor'].reconcile(anchor, options);
      } else if (anchor.cellType === CellTypes.ONE_CELL) {
        this.map['xdr:oneCellAnchor'].reconcile(anchor, options);
      } else {
        // unknown type
      }
    });
  }
}

DrawingXform.DRAWING_ATTRIBUTES = {
  'xmlns:xdr': 'http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing',
  'xmlns:a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
};

module.exports = DrawingXform;
