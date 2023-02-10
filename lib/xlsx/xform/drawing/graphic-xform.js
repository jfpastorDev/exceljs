const BaseXform = require('../base-xform');
const GraphicDataXform = require('./graphic-data-xform');

class GraphicXform extends BaseXform {
  constructor() {
    super();

    this.map = {
      'a:graphicData': new GraphicDataXform(),
    };
  }

  get tag() {
    return 'a:graphic';
  }

  render(xmlStream, model) {
    xmlStream.openNode(this.tag);
    this.map['a:graphicData'].render(xmlStream, model.graphicData);
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
        this.model.graphicData = this.map['a:graphicData'].model;
        return false;
      default:
        return true;
    }
  }
}

module.exports = GraphicXform;
