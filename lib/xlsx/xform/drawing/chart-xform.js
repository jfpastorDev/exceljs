const BaseXform = require('../base-xform');

class ChartXform extends BaseXform {
  get tag() {
    return 'c:chart';
  }

  render(xmlStream, model) {
    if (!(model && model.rId)) {
      return;
    }
    xmlStream.leafNode(this.tag, {
      'xmlns:c': 'http://schemas.openxmlformats.org/drawingml/2006/chart',
      'xmlns:r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
      'r:id': model.rId,
    });
  }

  parseOpen(node) {
    switch (node.name) {
      case this.tag:
        this.model = {
          chart: {
            rId: node.attributes['r:id'],
          },
        };
        return true;
      default:
        return true;
    }
  }

  parseText() {}

  parseClose() {
    return false;
  }
}

module.exports = ChartXform;
