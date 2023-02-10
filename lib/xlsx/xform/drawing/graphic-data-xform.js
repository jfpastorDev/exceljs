const BaseXform = require('../base-xform');
const ChartXform = require('./chart-xform');

class GraphicDataXform extends BaseXform {
  constructor() {
    super();

    this.map = {
      'c:chart': new ChartXform(),
    };
  }

  get tag() {
    return 'a:graphicData';
  }

  render(xmlStream, model) {
    xmlStream.openNode(this.tag, {uri: 'http://schemas.openxmlformats.org/drawingml/2006/chart'});
    this.map['c:chart'].render(xmlStream, model.chart);
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

  parseText() {}

  parseClose(name) {
    if (this.parser) {
      if (!this.parser.parseClose(name)) {
        this.parser = undefined;
      }
      return true;
    }
    switch (name) {
      case this.tag:
        if (!this.model) {
          this.model = {};
        }
        this.model = this.map['c:chart'].model;
        return false;
      default:
        return true;
    }
  }
}

module.exports = GraphicDataXform;
